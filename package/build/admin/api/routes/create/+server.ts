import { dev } from '$app/environment';
import db from 'svelteCMS/lib/db.server';
import utils from 'svelteCMS/lib/utils/utils.server';
import { json } from '@sveltejs/kit';
import { appCollectionNames } from "svelteCMS/lib/data"
import type { ApiRouteCreate,AppCollectionNames,AppRouteData } from 'svelteCMS/types';
import type { RequestHandler } from './$types';

// TODO: deal with mongodb
export const POST: RequestHandler = async (event) => {
    const jsonInputData:ApiRouteCreate['input'] = await event.request.json()
    const routeID = jsonInputData.id.trim()
    // @ts-ignore check if route id is one of the collection names needed for cms
    if(appCollectionNames.includes(routeID)){
        const response:ApiRouteCreate['output'] = {
            error:true,
            message:`Routes id can not be: ${appCollectionNames.join(",")}`
        } 
        return json(response)
    }
    // check if route ends with s, if not return error
    if(!routeID.endsWith("s")){
        const response:ApiRouteCreate['output'] = {
            error:true,
            message:`Routes most end with an s, example: posts,categories,tags`
        } 
        return json(response)
    }
    // run code
    const colName:AppCollectionNames = "_App"
    const appCol = db.collection(colName)
    // check if route id exists, if it does, return error
    const filter = { key:"collection","data.id":routeID }
    const routeData = await appCol.findOne(filter) as AppRouteData|null
    if(routeData){ 
        const response:ApiRouteCreate['output'] = {
            error:true,
            message:`Route with id:${routeID} already exists`,
        } 
        return json(response) 
    }
    // try create / insert new route
    // update updatedAt string to Date object
    jsonInputData['updatedAt'] = new Date()
    const newRouteData:AppRouteData = {
        key:"collection",
        data:jsonInputData
    }
    const newRouteRes = await appCol.insertOne(newRouteData)
    if(newRouteRes.acknowledged){
        // create fetcher and types
        if(dev) utils.gen([...event.locals.svelteCMS.routes,jsonInputData])
        // return response
        const response:ApiRouteCreate['output'] = {
            error:false,
            message:`Route '${jsonInputData.id}' was created `,
            data:jsonInputData
        } 
        return json(response)
    }
    // return error
    const response:ApiRouteCreate['output'] = {
        error:true,
        message:"Something went wrong creating route"
    } 
    return json(response)
};