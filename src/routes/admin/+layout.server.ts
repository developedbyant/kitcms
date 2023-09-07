import type { LayoutServerLoad } from "./$types"
import type { RouteData } from "mdbCMS/types"

export const load:LayoutServerLoad = async(event)=> {
    const theme:"dark"|"light" = event.cookies.get("theme") as "dark"|"light" | undefined || "dark"   
    const userData = event.locals.mdbCMS.userData
    const appData = event.locals.mdbCMS.appData
    const routes:RouteData[] = event.locals.mdbCMS.routes    
    return { mdbCMS:{ theme,routes,userData,appData } }
}