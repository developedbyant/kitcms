import type { PageServerLoad } from "./$types"

/** RouteID is handle by +layout.server.ts, if we get here is because route exists */
export const load:PageServerLoad = async(event)=> {
    const parentData = await event.parent()
    return { routeData:parentData.routeData }   
}