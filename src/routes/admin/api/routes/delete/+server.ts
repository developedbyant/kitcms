import { dev } from '$app/environment';
import db from 'svelteCMS/lib/db.server';
import utils from 'svelteCMS/lib/utils/utils.server';
import { json } from '@sveltejs/kit';
import type { AppCollectionNames,AppRouteData, ApiRouteDelete } from 'svelteCMS/types';
import type { RequestHandler } from './$types';

// TODO: delete linked routes
export const POST: RequestHandler = async (event) => {
    const jsonInputData:ApiRouteDelete['input'] = await event.request.json()
    const routeID = jsonInputData.id.trim()
    // run code
    const colName:AppCollectionNames = "_App"
    const appCol = db.collection(colName)
    // check if route id exists, if it does not, return error
    const filter = { key:"collection","data.id":routeID }
    const routeData = await appCol.findOne(filter) as AppRouteData|null
    if(!routeData){ 
        const response:ApiRouteDelete['output'] = {
            error:true,
            message:`Route'${routeID}' not founded`,
        } 
        return json(response) 
    }
    // delete route
    const routeDeletedRes = await appCol.deleteOne(filter)
    if(routeDeletedRes.acknowledged){
        // delete route collection
        db.collection(routeID).drop()
        // create fetcher and types
        if(dev) utils.gen(event.locals.svelteCMS.routes)
        // return response
        const response:ApiRouteDelete['output'] = {
            error:false,
            message:`Route '${jsonInputData.id}' was deleted `,
            data:jsonInputData
        } 
        return json(response)
    }
    // return error
    const response:ApiRouteDelete['output'] = {
        error:true,
        message:"Something went wrong"
    } 
    return json(response)
};