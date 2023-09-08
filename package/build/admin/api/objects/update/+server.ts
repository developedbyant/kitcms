import db from 'svelteCMS/lib/db.server';
import { json } from '@sveltejs/kit';
import { ObjectId } from "mongodb"
import type { Db } from "mongodb"
import type { AppCollectionNames,AppRouteData,ApiObjectUpdate } from 'svelteCMS/types';
import type { RequestHandler } from './$types';

// TODO: deal with mongodb
export const POST: RequestHandler = async (event) => {
    const jsonInputData:ApiObjectUpdate['input'] = await event.request.json()
    const routeID = jsonInputData.routeID.trim() as any
    // run code
    const colName:AppCollectionNames = "_App"
    const appCol = db.collection(colName)
    const objectsCol = db.collection(routeID)
    // check if route id exists, if not, return error
    const filter = { key:"collection","data.id":routeID }
    const routeData = await appCol.findOne(filter) as AppRouteData|null
    if(!routeData){ 
        const response:ApiObjectUpdate['output'] = {
            error:true,
            message:`Route with id:${routeID} does not exists`,
        } 
        return json(response) 
    }
    // try update object
    const newObjectData = {...jsonInputData.objectData}
    const objectID = jsonInputData.objectData._id
    // remove _id from object data before setting new data
    delete newObjectData['_id']
    // update data
    const updatedObjectRes = await objectsCol.updateOne({ _id:new ObjectId(objectID)},{$set:newObjectData})
    if(updatedObjectRes.acknowledged){
        // update handler
        handleUpdate(db,jsonInputData)
        // return response
        const response:ApiObjectUpdate['output'] = {
            error:false,
            message:`Object with id '${objectID }' was updated `,
            data:{...jsonInputData.objectData,_id:objectID }
        } 
        return json(response)
    }
    // return error
    const response:ApiObjectUpdate['output'] = {
        error:true,
        message:"Something went wrong creating route"
    } 
    return json(response)
};

/** update object where it's being use */
async function handleUpdate(db:Db,jsonData:ApiObjectUpdate['input']) {
    const routeID = jsonData.routeID
    const objectData = jsonData.objectData
    const objectID = typeof jsonData.objectData._id === "string" ? jsonData.objectData._id : jsonData.objectData._id.toString()
    objectData['_id'] = objectID
    const appCol = db.collection("_App")
    const filter = { key:"collection","data.blocks.link.toRoute":routeID }
    const cursor = appCol.find(filter) as any
    const routeLinking = await cursor.toArray() as AppRouteData[]
    for(const routeData of routeLinking){
        const blocksLinking = routeData.data.blocks.filter(data=>data.type==="linkRoute")
        // loop all blocks linking to file
        for(const blockData of blocksLinking){
            const oneToMany = blockData.link?.oneToMany
            const objectFilter = { [`${blockData.id}._id`]:objectID }
            const dataToSet = { [oneToMany?`${blockData.id}.$`:`${blockData.id}`] :objectData }
            const routeLinkingToObject = blockData.link!.fromRoute
            await db.collection(routeLinkingToObject).updateMany(objectFilter,{ $set:dataToSet })
        }
    }
}