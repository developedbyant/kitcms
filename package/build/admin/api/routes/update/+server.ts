import { dev } from '$app/environment';
import db from 'svelteCMS/lib/db.server';
import utils from 'svelteCMS/lib/utils/utils.server';
import { json } from '@sveltejs/kit';
import type { AppCollectionNames,AppRouteData, ApiRouteUpdate } from 'svelteCMS/types';
import type { RequestHandler } from './$types';

// TODO: deal with mongodb
export const POST: RequestHandler = async (event) => {
    const jsonInputData:ApiRouteUpdate['input'] = await event.request.json()
    const routeID = jsonInputData.id.trim()
    // run code
    const colName:AppCollectionNames = "_App"
    const appCol = db.collection(colName)
    // check if route id exists, if it does not, return error
    const filter = { key:"collection","data.id":routeID }
    const routeData = await appCol.findOne(filter) as AppRouteData|null
    if(!routeData){ 
        const response:ApiRouteUpdate['output'] = {
            error:true,
            message:`Route'${routeID}' not founded`,
        } 
        return json(response) 
    }
    // try update / update route
    // update updatedAt string to Date object
    jsonInputData['updatedAt'] = new Date()
    const newRouteData:AppRouteData = {
        key:"collection",
        data:jsonInputData
    }
    const updateRouteRes = await appCol.updateOne(filter,{ $set:{...newRouteData} })
    if(updateRouteRes.acknowledged){
        // create fetcher and types
        if(dev) utils.gen(event.locals.svelteCMS.routes)
        // return response
        const response:ApiRouteUpdate['output'] = {
            error:false,
            message:`Route '${jsonInputData.id}' was updated `,
            data:jsonInputData
        } 
        return json(response)
    }
    // return error
    const response:ApiRouteUpdate['output'] = {
        error:true,
        message:"Something went wrong"
    } 
    return json(response)
};