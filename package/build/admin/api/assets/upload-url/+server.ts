import db from 'svelteCMS/lib/db.server';
import { json } from '@sveltejs/kit';
import utils from 'svelteCMS/lib/utils/utils.server';
import type { RequestHandler } from './$types';
import type { ApiAssetUploadUrl } from 'svelteCMS/types';

export const POST: RequestHandler = async (event) => {
    // check if asset provider exists, if not return error
    const assetProvider = event.locals.svelteCMS.appData.assetProvider
    if(!assetProvider){
        const response:ApiAssetUploadUrl['output'] = {
            error:true,
            message:"Please set an asset provider on setting page",
        }
        return json(response);
    }
    // else upload asset
    const appCol = db.collection("_App")
    const assetsCol = db.collection("_Assets")
    const InputData:ApiAssetUploadUrl['input'] = await event.request.json()
    const assetUrl = InputData.url
    const assetName = InputData.assetName
    // @ts-ignore list of asset providers
    const assetProviders = await appCol.find().toArray() as AppProviderData[]
    // upload to cloudinary
    const cloudinaryData = assetProviders.find(data=>data.data.name==="cloudinary")
    if(assetProvider==="cloudinary" && cloudinaryData && cloudinaryData.data.name==="cloudinary"){
        const assetProviderData = cloudinaryData.data
        const cloudinary = new utils.Cloudinary(assetProviderData.cloudName,assetProviderData.apiKey,assetProviderData.apiSecretKey)
        const uploadRes = await cloudinary.uploadFile(assetUrl,assetName)
        // if asset was uploaded to cloudinary
        if(uploadRes){
            const insertedAssetRes = await assetsCol.insertOne(uploadRes)
            const assetData = {...uploadRes,_id:insertedAssetRes.insertedId.toString() }
            const response:ApiAssetUploadUrl['output'] = {
                error:false,
                message:"Asset was created",
                data:assetData
            }
            return json(response); 
        }
    }else if(assetProvider==="test"){
        // return default error
        const response:ApiAssetUploadUrl['output'] = {
            error:true,
            message:"Test provider not supported yet, use another asset provider"
        }
        return json(response);
    }
    // return default error
    const response:ApiAssetUploadUrl['output'] = {
        error:true,
        message:"Something went wrong"
    }
    return json(response);
};