import db from 'svelteCMS/lib/db.server';
import { error } from "@sveltejs/kit"
import { ObjectId } from "mongodb"
import type { PageServerLoad } from "./$types"

// TODO: deal with mongodb
export const load:PageServerLoad = async(event)=> {
    const routeID = event.params.routeID
    const objectID = event.params.objectID
    const objectsCol = db.collection(routeID)
    // check if object exists, if not throw error
    const filter = { _id:new ObjectId(objectID)}
    const objectData = await objectsCol.findOne(filter) as {[key:string]:any} | null
    if(!objectData) throw error(404,`Object with id '${objectID}' was not founded`)
    // else convert _id ObjectId to string and return object data
    objectData['_id'] = objectData['_id'].toString()
    return { objectData }   
}