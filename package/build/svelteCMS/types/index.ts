export type * from "./api"
export type * from "./generated"
export type * from "./app"
import type { ApiEndpoints } from "./api"
export type { ObjectId } from "mongodb"
import type { ObjectId } from "mongodb"
import type { RequestEvent } from "@sveltejs/kit"

// ASSETS =======================================================
/** Data object for asset */
export type AssetData = {
    _id: ObjectId | string
    id:string
    provider:"cloudinary"|"app"
    src:string
    title:string
    type:string
    extension:string
}
/** Data object from asset to upload new asset */
export type AssetLoad = Omit<AssetData,"_id">
/** Data object for linked asset */
export type LinkedAssetData = {
    _id: ObjectId | string
    fromRouteID:string
    fromKey:string
    oneAsset:boolean
}

/** Data needed to create linked asset */
export type LinkedAssetLoad = Omit<LinkedAssetData,"_id">


// USERS =======================================================
/** Data object for admin user */
export type UserData = {
    _id : ObjectId | string
    role:"admin"|"editor"|"user"|string
    firstName:string
    lastName:string
    email: string
    password: string
    createdAt:Date
    image:AssetData|null
}
/** Data needed to create admin user */
export type UserLoad = Omit<UserData,"_id">

/** Data needed to login user */
export type UserSessionData = {
    _id: ObjectId | string
    userID:string
    createdAt:Date
    expireAt:Date
    ip:string
    browser:string
}
/** Data needed to create new session */
export type UserSessionLoad = Omit<UserSessionData,"_id">

// ROUTES =======================================================
/** Route data */
export type RouteData = {
    id:string
    singularID:string
    title:string
    description:string
    // Keys to use when searching for objects
    searchAbleKeys:string[]
    blocks:RouteBlockData[]
    updatedAt:Date 
}
/** Data needed to create new route */
export type RouteLoad = RouteData

/** Blocks inside a route, blocks make route schema */
export type RouteBlockData = {
    id:string
    type:RouteBlockTypes
    /** Link to any other route */
    link?:{
        fromRoute:string
        fromKey:string
        toRoute:string
        toKey:string
        /** Indicate if this is a one to many relation */
        oneToMany:boolean
    }
    /** data for when using ObjectList, it help use generate types and other */
    objectKeys?:ObjectListItemData
}
export type ObjectListItemData = {[key:string]: "string" | "number" | "boolean" | "date" }
/** Block types */
export type RouteBlockTypes = "input" | "text" | "number" | "date" | "boolean" | "file" | "files" | "linkRoute" | "editor" | "slug" | "stringList" | "keyObjectList" | "objectList"

export type ObjectData = { [key:string]:any }

// SYSTEM AND MIDDLEWARE =======================================================
/** Function response */
export type MiddleWareResponse = {
    error:boolean
    message:string
}

/** File handler plugin type */
// export type FileHandlerFunc = (data:{file:File,name?:string})=> Promise<MiddleWareResponse<AssetData>>
// export type FileSearchHandler = (data:{file:File,name?:string})=> Promise<MiddleWareResponse<AssetData>>

/** Data to describe plugin, optional pass FuncData to use as data:Type */
export type MiddlewareFunc = (event:RequestEvent)=> Promise<MiddleWareResponse>
type MiddleWares = Partial<{[key in ApiEndpoints]:MiddlewareFunc[]}>

/** CMS configurations */
export type ConfigFile = {
    default?:{
        image?:AssetData
        video?:AssetData
    }
    /** Run middle ware on api end points */
    middleWares?:MiddleWares,
    // plugins?:{
    //     fileHandler?:FileHandlerFunc
    // }
}