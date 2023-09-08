import { redirect, json } from '@sveltejs/kit';
import db from 'svelteCMS/lib/db.server';
import Auth from 'svelteCMS/lib/auth.server';
import type { AppData,ConfigFile, MiddlewareFunc, RouteData } from 'svelteCMS/types';
import type { Handle} from '@sveltejs/kit';
const CWD = process.cwd()
const CONFIG_PATH = `${CWD}/svelteCMS.js`

/** Run custom hooks
 * 1 - if user is not browsing admin path skip all, just return event
 * 2 - Make sure user is logged in, if not redirect to login page
 * 3 - Add middle wares to api endPoints if they were set inside svelteCMS.js */

const handle:Handle = async({event,resolve})=>{
    // check if we are in admin path, if not return event right away
    const browsingAdmin = event.url.pathname.startsWith("/admin")
    if(!browsingAdmin) return await resolve(event)
    // @ts-ignore set svelteCMS object to locals to avoid error
    event.locals.svelteCMS = { appData:{ assetProvider:undefined } }
    const pathname = event.url.pathname
    const eventMethod = event.request.method

    // AUTH =================================================
    const auth = new Auth(db)
    const sessionValidated = await auth.sessionValidate(event)
    // if user is not logged in and not browsing login or register page, redirect to login page
    if(!sessionValidated && !["/admin/api/users/login","/admin/auth/login"].includes(pathname)){
        throw redirect(302,"/admin/auth/login")
    }
    // else add userData and mongodb to locals
    if(sessionValidated){
        // USER DATA =================================================
        const userData = sessionValidated.userData
        // set user data to locals
        event.locals.svelteCMS.userData = userData

        // APP DATA =================================================
        const appCol = db.collection("_App")
        const appData = await appCol.findOne({ key:"app" }) as AppData & { _id:any } | null
        // create app data if not exists
        if(!appData){
            const newAppData:AppData = {
                key: 'app',
                data: { assetProvider: undefined, assetsPerPage: 5, usersPerPage: 5, routesPerPage: 5, objectsPerPage: 5 }
            }
            await appCol.insertOne(newAppData)
            // set data to locals
            event.locals.svelteCMS.appData = newAppData.data
        }else event.locals.svelteCMS.appData = appData.data

        // TYPES =================================================
        const routesCursor = appCol.find({ key:"collection" }).map((data:any)=>data['data'])
        const routes:RouteData[] = await routesCursor.toArray()
        // add routes to locals
        event.locals.svelteCMS.routes = routes
    }

    // CMS CONFIG =================================================
    const configData:ConfigFile = (await import(/* @vite-ignore */CONFIG_PATH)).default
    if(["POST","DELETE","UPDATE"].includes(eventMethod) && (configData.middleWares && pathname in configData.middleWares)){
        /** @ts-ignore */
        const middleWares = configData.middleWares[pathname] as MiddlewareFunc[]
        for(const middle of middleWares){
            const middlewareRes = await middle(event)
            if(middlewareRes.error) return json(middlewareRes)
        }
    }
    
    // Return event
    const response = await resolve(event);
    return response;
}
export default handle