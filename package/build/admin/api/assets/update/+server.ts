import db from 'svelteCMS/lib/db.server';
import { json } from '@sveltejs/kit';
import { ObjectId } from "mongodb"
import type { Db } from "mongodb"
import type { RequestHandler } from './$types';
import type { ApiAssetUpdate, AppRouteData, AssetData, RouteData } from 'svelteCMS/types';

export const POST: RequestHandler = async (event) => {
    const inputData:ApiAssetUpdate['input'] = await event.request.json()
    const assetsCol = db.collection("_Assets")
    // check if asset exists, if not return error
    const filter = { _id:new ObjectId(inputData._id)}
    const assetExists = await assetsCol.findOne(filter)
    if(!assetExists){
        const response:ApiAssetUpdate['output'] = {
            error:true,
            message:`Asset with id ${inputData._id} not founded`
        }
        return json(response);
    }
    // update asset from asset database
    const updateRes = await assetsCol.updateOne(filter,{$set:{ title:inputData.title.trim() }})
    if(updateRes.acknowledged){
        // update handler
        handleUpdate(db,inputData)
        // return response
        const response:ApiAssetUpdate['output'] = {
            error:false,
            message:`Asset with id ${inputData._id} was updated`,
            data:inputData
        }
        return json(response); 
    }
    // return default error
    const response:ApiAssetUpdate['output'] = {
        error:true,
        message:"Something went wrong"
    }
    return json(response);
};


/** update asset title where ever it's linked to */
async function handleUpdate(db:Db,newAssetData:AssetData) {
    const appCol = db.collection("_App")
    const filter = { key:"collection",$or:[ {"data.blocks.type":"file"},{"data.blocks.type":"files"}]}
    const cursor = appCol.find(filter) as any
    const routeLinking = await cursor.toArray() as AppRouteData[]
    for(const routeData of routeLinking){
        const routeID = routeData.data.id
        // find keys in route linking to files
        const blocksLinking = routeData.data.blocks.filter(data=>["file","files"].includes(data.type))
        // loop all blocks linking to file
        for(const blockData of blocksLinking){
            const oneToMany = blockData.type==="files"
            const objectFilter = { [`${blockData.id}.id`]:newAssetData.id }
            const dataToSet = { [oneToMany?`${blockData.id}.$.title`:`${blockData.id}.title`] :newAssetData.title }
            await db.collection(routeID).updateMany(objectFilter,{ $set:dataToSet })
        }
    }
}