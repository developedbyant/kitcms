import db from 'svelteCMS/lib/db.server';
import { json } from '@sveltejs/kit';
import type { AppCollectionNames,ApiAssetSearch, AssetData } from 'svelteCMS/types';
import type { RequestHandler } from './$types';

// TODO: deal with mongodb
export const POST: RequestHandler = async (event) => {
    const jsonInputData:ApiAssetSearch['input'] = await event.request.json()
    // search assets
    const colName:AppCollectionNames = "_Assets"
    const assetsCol = db.collection(colName)
    const filter = { title:{ $regex:new RegExp(jsonInputData.query,"ig")} }
    const assetsCursor = assetsCol.find(filter).limit(jsonInputData.limit)
    const assets:AssetData[] = await assetsCursor.toArray() as any
    const response:ApiAssetSearch['output'] = {
        error:false,
        message:"Here are some objects",
        data:assets
    } 
    return json(response)
};