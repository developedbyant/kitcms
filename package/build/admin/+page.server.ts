import db from "svelteCMS/lib/db.server";
import type { PageServerLoad } from "./$types"
import type { AppCollectionNames } from "svelteCMS/types"

export const load:PageServerLoad = async(event)=> {
    const colName:AppCollectionNames = "_Assets"
    const assetsCol = db.collection(colName)
    const assetsCursor = assetsCol.find().limit(15).map((data:any)=>{
        data['_id'] = data['_id'].toString()
        return data
    }).limit(18)
    const assets = await assetsCursor.toArray()
    const stats = {
        routes:await db.collection("_App").countDocuments({ key:"collection" }),
        assets:await db.collection("_Assets").countDocuments(),
        users:await db.collection("_Users").countDocuments(),
    }
    return { assets,stats }
}