import db from 'svelteCMS/lib/db.server';
import { json } from '@sveltejs/kit';
import utils from 'svelteCMS/lib/utils/utils.server';
import { ObjectId } from "mongodb"
import type { Db } from "mongodb"
import type { RequestHandler } from './$types';
import type { ApiAssetDelete, AppRouteData, AssetData, AssetProviders } from 'svelteCMS/types';

export const POST: RequestHandler = async (event) => {
    const inputData:ApiAssetDelete['input'] = await event.request.json()
    const assetsCol = db.collection("_Assets")
    const appCol = db.collection("_App")
    // check if asset exists, if not return error
    const filter = { _id:new ObjectId(inputData._id)}
    const assetExists = await assetsCol.findOne(filter)
    if(!assetExists){
        const response:ApiAssetDelete['output'] = {
            error:true,
            message:`Asset with id ${inputData._id} not founded`
        }
        return json(response);
    }
    // check if asset's provider to be deleted exists in providers list, if not return error
    const currentProvider = event.locals.svelteCMS.appData.assetProvider
    const assetProviderData = await appCol.findOne({ key:"provider","data.name":currentProvider }) as AssetProviders|null
    if(!assetProviderData){
        const response:ApiAssetDelete['output'] = {
            error:true,
            message:`Please add asset provider ${inputData.provider}`
        }
        return json(response);
    }
    // delete asset from asset provider
    const assetProvider = assetProviderData.name
    if(assetProvider==="cloudinary"){
        const cloudinary = new utils.Cloudinary(assetProviderData.cloudName,assetProviderData.apiKey,assetProviderData.apiSecretKey)
        await cloudinary.deleteFile(inputData.id)
    }
    // delete asset from asset database
    const deleteRes = await assetsCol.deleteOne(filter)
    if(deleteRes.acknowledged){
        // delete handler
        handleDelete(db,inputData)
        // return response
        const response:ApiAssetDelete['output'] = {
            error:false,
            message:`Asset with id ${inputData._id} was deleted`,
            data:inputData
        }
        return json(response); 
    }
    // return default error
    const response:ApiAssetDelete['output'] = {
        error:true,
        message:"Something went wrong"
    }
    return json(response);
};


/** delete asset from objects when asset is deleted */
async function handleDelete(db:Db,newAssetData:AssetData) {
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
            const dataToSet = oneToMany ? { $pull:{ [blockData.id]:{id:newAssetData.id } } } : { $set:{[blockData.id]:null } }
            // @ts-ignore
            await db.collection(routeID).updateMany(objectFilter,dataToSet)
        }
    }
}