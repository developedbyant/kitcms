import db from 'svelteCMS/lib/db.server';
import type { AssetData } from 'svelteCMS/types';
import type { PageServerLoad } from './$types';

export const load:PageServerLoad = async(event)=> {
    const appData = event.locals.svelteCMS.appData
    const pageNum = Number(event.url.searchParams.get("page")) || 1
    const skipNum = pageNum > 1 ? (pageNum * appData.assetsPerPage) - appData.assetsPerPage : 0
    const assetsCol = db.collection("_Assets")
    const query = event.url.searchParams.get("query")
    const filter = query ? { title:new RegExp(query,"i")} : {}
    const assetsCursor = assetsCol.find(filter).limit(appData.assetsPerPage?appData.assetsPerPage:6).sort("_id","desc")
    const assets:AssetData[] = await assetsCursor.map((data:any)=>{ data['_id'] = data['_id'].toString() ; return data }).skip(skipNum).toArray()
    // return assets 
    return { assets }
}