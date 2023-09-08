import db from 'svelteCMS/lib/db.server';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { ApiSetAssetProvider, AppCollectionNames, AppProviderData } from 'svelteCMS/types';

export const POST: RequestHandler = async (event) => {
    const inputData:ApiSetAssetProvider['input'] = await event.request.json()
    const appColName:AppCollectionNames = "_App"
    const appCol = db.collection(appColName)
    // check if provider already exists, if yes return error
    const providerData = await appCol.findOne({ key:"provider","data.name":inputData.name }) as AppProviderData|null
    if(providerData){
        const response:ApiSetAssetProvider['output'] = {
            error:true,
            message:`Provider with key '${inputData.name}' already exists`
        }
        return json(response);
    }
    // else create provider
    const newProviderData:AppProviderData = { key:"provider",data:inputData }
    const insertRes = await appCol.insertOne(newProviderData)
    if(insertRes.acknowledged){
        const response:ApiSetAssetProvider['output'] = {
            error:false,
            message:"New asset provider was added",
            data:inputData
        }
        return json(response);
    }
    // return something went wrong response
    return json({ error:true,message:"Something went wrong"})
}