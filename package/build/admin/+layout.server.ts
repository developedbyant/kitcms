import type { LayoutServerLoad } from "./$types"
import type { RouteData } from "svelteCMS/types"

export const load:LayoutServerLoad = async(event)=> {
    const theme:"dark"|"light" = event.cookies.get("theme") as "dark"|"light" | undefined || "dark"   
    const userData = event.locals.svelteCMS.userData
    const appData = event.locals.svelteCMS.appData
    const routes:RouteData[] = event.locals.svelteCMS.routes    
    return { svelteCMS:{ theme,routes,userData,appData } }
}