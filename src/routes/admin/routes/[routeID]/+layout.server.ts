import db from "mdbCMS/lib/db.server";
import { error } from "@sveltejs/kit"
import type { AppCollectionNames,AppRouteData } from "mdbCMS/types"
import type { LayoutServerLoad } from "./$types"

// TODO: deal with mongodb
export const load:LayoutServerLoad = async(event)=> {
    const routeID = event.params.routeID
    const appColName:AppCollectionNames = "_App"
    const appCol = db.collection(appColName)
    // find route data inside app collection
    const appRouteData = await appCol.findOne({ key:"collection","data.id":routeID}) as AppRouteData|null
    // if route does not exists
    if(!appRouteData) throw error(404,`Route '${routeID}' not founded`)
    // else return route data
    const routeData:AppRouteData['data'] = {...appRouteData.data} 
    return { routeData }   
}