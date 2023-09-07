import type { RouteData } from "./index"
import type { ApiEndpoints } from "./api"
import type { RequestEvent } from "@sveltejs/kit"

// ALL ABOUT _App COLLECTION =======================================================
export type AppColKeys = "version" | "collection" | "assetProvider"
/** Info about current app */
export interface AppData {
    key:"app"
    data:{
        assetProvider:AssetProvidersNames|undefined
        assetsPerPage:number
        usersPerPage:number
        routesPerPage:number
        objectsPerPage:number
    }
}
export interface AppRouteData {
    key:"collection"
    data:RouteData
}
export interface AppProviderData {
    key:"provider"
    data:AssetProviders
}
/** List of asset providers */
export type AssetProviders = AssetProviderCloudinary | AssetProviderTest
export type AssetProviderCloudinary = {
    name:"cloudinary",
    cloudName:string
    apiKey:string
    apiSecretKey:string
}
export type AssetProviderTest = {
    name:"test",
    testCloud:string
    url:string
}
/** List of asset providers names */
export type AssetProvidersNames = "cloudinary"|"test"
/** List of collection names for CMS */
export type AppCollectionNames =  "_Assets" | "_App" | "_Sessions"


// SYSTEM AND MIDDLEWARE =======================================================

/** Function response */
export type MiddleWareFuncResponse<Data> = {
    error:true
    message:string
} | {
    error:false
    message:string
    data:Data
}
/** Data to describe plugin, optional pass FuncData to use as data:Type */
export type MiddlewareFunc<Data=any> = (event:RequestEvent)=> Promise<MiddleWareFuncResponse<Data>>
type MiddleWares = Partial<{[key in ApiEndpoints]:MiddlewareFunc[]}>
/** CMS configurations */
export type ConfigFile = {
    /** Run middle ware on api end points */
    middleWares?:MiddleWares
}

/** App Settings */
export type SettingsData = {
    usersPerPage:number
    assetsPerPage:number
    routesPerPage:number
    objectsPerPage:number
}