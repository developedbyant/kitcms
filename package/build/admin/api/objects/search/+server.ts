import db from 'svelteCMS/lib/db.server';
import { json } from '@sveltejs/kit';
import type { AppCollectionNames,ApiObjectSearch } from 'svelteCMS/types';
import type { RequestHandler } from './$types';

// TODO: deal with mongodb
export const POST: RequestHandler = async (event) => {
    const jsonInputData:ApiObjectSearch['input'] = await event.request.json()
    const routeID = jsonInputData.routeID.trim() as any
    // search objects
    const colName:AppCollectionNames = routeID
    const objectsCol = db.collection(colName)
    const filter = { [jsonInputData.query.targetKey]:{ $regex:new RegExp(jsonInputData.query.text,"ig")} }
    const objectsCursor = objectsCol.find(filter).limit(jsonInputData.limit)
    const objects:{[key:string]:any}[] = await objectsCursor.toArray()
    const response:ApiObjectSearch['output'] = {
        error:false,
        message:"Here are some objects",
        data:objects
    } 
    return json(response)
};