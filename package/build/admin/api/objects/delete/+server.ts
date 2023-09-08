import db from 'svelteCMS/lib/db.server';
import { json } from '@sveltejs/kit';
import { ObjectId } from "mongodb"
import type { Db } from "mongodb"
import type { ApiObjectDelete,AppCollectionNames,AppRouteData } from 'svelteCMS/types';
import type { RequestHandler } from './$types';

// TODO: deal with mongodb
export const POST: RequestHandler = async (event) => {
    const jsonInputData:ApiObjectDelete['input'] = await event.request.json()
    const routeID = jsonInputData.routeID.trim() as any
    // run code
    const colName:AppCollectionNames = "_App"
    const appCol = db.collection(colName)
    const objectsCol = db.collection(routeID)
    // check if route id exists, if not, return error
    const filter = { key:"collection","data.id":routeID }
    const routeData = await appCol.findOne(filter) as AppRouteData|null
    if(!routeData){         
        const response:ApiObjectDelete['output'] = {
            error:true,
            message:`Route with id:${routeID} does not exists`,
        } 
        return json(response) 
    }
    // try delete / delete object
    const deleteObjectRes = await objectsCol.deleteOne({ _id: new ObjectId(jsonInputData.objectData._id)})
    if(deleteObjectRes.deletedCount>0){
        // update handler
        handleDelete(db,jsonInputData)
        // return response
        const response:ApiObjectDelete['output'] = {
            error:false,
            message:`Object with id '${jsonInputData.objectData._id}' was deleted `,
            data:{...jsonInputData.objectData }
        } 
        return json(response)
    }
    // return error
    const response:ApiObjectDelete['output'] = {
        error:true,
        message:"Something went wrong"
    } 
    return json(response)
};

/** delete object from object linking to this object */
async function handleDelete(db:Db,jsonData:ApiObjectDelete['input']) {
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
            const dataToSet = oneToMany ? { $pull:{ [blockData.id]:{_id:objectID } } } : { $set:{[blockData.id]:null } }
            const routeLinkingToObject = blockData.link!.fromRoute
            // @ts-ignore
            await db.collection(routeLinkingToObject).updateMany(objectFilter,dataToSet)
        }
    }
}