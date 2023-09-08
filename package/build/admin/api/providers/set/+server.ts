import db from 'svelteCMS/lib/db.server';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { ApiAssetProviderSet, AppCollectionNames, AppProviderData } from 'svelteCMS/types';

export const POST: RequestHandler = async (event) => {
    const inputData:ApiAssetProviderSet['input'] = await event.request.json()
    const appColName:AppCollectionNames = "_App"
    const appCol = db.collection(appColName)
    // check if provider already exists, if not return error
    const providerData = await appCol.findOne({ key:"provider","data.name":inputData.name }) as AppProviderData|null
    if(!providerData){
        const response:ApiAssetProviderSet['output'] = {
            error:true,
            message:`Provider with key '${inputData.name}' does not exists`
        }
        return json(response);
    }
    // update app collection
    const updateRes = await appCol.updateOne({ key:"app" },{ $set:{ "data.assetProvider":inputData.name }})
    // if data was updated
    if(updateRes.acknowledged){
        const response:ApiAssetProviderSet['output'] = {
            error:false,
            message:`Asset provider ${inputData.name} set to be used`,
            data:inputData
        }
        return json(response);
    }
    // return default error
    const response:ApiAssetProviderSet['output'] = {
        error:true,
        message:"Something went wrong"
    }
    return json(response);
}