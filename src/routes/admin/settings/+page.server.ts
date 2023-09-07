import db from "mdbCMS/lib/db.server";
import type { PageServerLoad } from "./$types"
import type { AppProviderData } from "mdbCMS/types"

export const load:PageServerLoad = async(event)=> {
    const appCol = db.collection("_App")
    const cursor = appCol.find({ key:"provider" }).map((data:any)=>{ delete data['_id'] ; return data })
    const assetProviders = await cursor.toArray() as AppProviderData[]
    return { assetProviders:assetProviders.map(data=>data.data.name) }
}