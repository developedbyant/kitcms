import db from 'svelteCMS/lib/db.server';
import { json } from '@sveltejs/kit';
import type { ApiObjectCreate,AppCollectionNames,AppRouteData } from 'svelteCMS/types';
import type { RequestHandler } from './$types';

// TODO: deal with mongodb
export const POST: RequestHandler = async (event) => {
    const jsonInputData:ApiObjectCreate['input'] = await event.request.json()
    const routeID = jsonInputData.routeID.trim() as any
    // run code
    const colName:AppCollectionNames = "_App"
    const appCol = db.collection(colName)
    const objectsCol = db.collection(routeID)
    // check if route id exists, if not, return error
    const filter = { key:"collection","data.id":routeID }
    const routeData = await appCol.findOne(filter) as AppRouteData|null
    if(!routeData){ 
        const response:ApiObjectCreate['output'] = {
            error:true,
            message:`Route with id:${routeID} does not exists`,
        } 
        return json(response) 
    }
    // try create / insert new object
    const newObjectData = jsonInputData.objectData
    const newObjectRes = await objectsCol.insertOne(newObjectData)
    if(newObjectRes.acknowledged){
        const response:ApiObjectCreate['output'] = {
            error:false,
            message:`Object with id '${newObjectRes.insertedId }' was created `,
            data:{...jsonInputData.objectData,_id:newObjectRes.insertedId }
        } 
        return json(response)
    }
    // return error
    const response:ApiObjectCreate['output'] = {
        error:true,
        message:"Something went wrong creating route"
    } 
    return json(response)
};