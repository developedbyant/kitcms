import db from 'svelteCMS/lib/db.server';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { ApiAssetProviderDelete, AppCollectionNames, AppProviderData } from 'svelteCMS/types';

export const POST: RequestHandler = async (event) => {
    const inputData:ApiAssetProviderDelete['input'] = await event.request.json()
    const appColName:AppCollectionNames = "_App"
    const appCol = db.collection(appColName)
    // check if provider already exists, if not return error
    const providerData = await appCol.findOne({ key:"provider","data.name":inputData.name }) as AppProviderData|null
    if(!providerData){
        const response:ApiAssetProviderDelete['output'] = {
            error:true,
            message:`Provider with key '${inputData.name}' already exists`
        }
        return json(response);
    }
    // delete provider
    const deleteRes = await appCol.deleteOne({ key:"provider","data.name":inputData.name })
    if(deleteRes.acknowledged){
        // if delete asset provider is the one being used, remove it
        if(event.locals.svelteCMS.appData.assetProvider === inputData.name){
            appCol.updateOne({ key:"app"},{$set:{"data.assetProvider":undefined }})
        }
        // return response
        const response:ApiAssetProviderDelete['output'] = {
            error:false,
            message:"Asset provider was deleted",
            data:inputData
        }
        return json(response);
    }
    // return something went wrong response
    return json({ error:true,message:"Something went wrong"})
}