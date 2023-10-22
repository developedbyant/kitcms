import db from "svelteCMS/lib/db.server";
import type { PageServerLoad } from "./$types"
import type { RouteData } from "svelteCMS/types"

export const load:PageServerLoad = async(event)=> {
    const appCol = db.collection("_App")
    const routesCursor = appCol.find({ key:"collection" }).map((data:any)=>data['data'])
    const routes:RouteData[] = await routesCursor.toArray() as any[]
    return { routes }
}