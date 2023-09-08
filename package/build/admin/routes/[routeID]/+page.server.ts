import db from "svelteCMS/lib/db.server";
import type { PageServerLoad } from './$types';

export const load:PageServerLoad = async(event)=> {
    const routeID = event.params.routeID
    const objectsCol = db.collection(routeID)
    const query = event.url.searchParams.get("query")
    const filter = query ? { $or:(await event.parent()).routeData.searchAbleKeys.map(data=>{ return{[data]:new RegExp(query,"i")} }) } : {}
    const objectsCursor = objectsCol.find(filter).limit(20)
    const objects = await objectsCursor.map((data:any)=>{
        data['_id'] = data['_id'].toString()
        return data
    }).toArray()
    // return objects 
    return { objects }
}