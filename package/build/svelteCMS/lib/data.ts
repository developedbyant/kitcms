import type { RouteBlockTypes,AppCollectionNames,AssetProvidersNames,AssetProviders } from "svelteCMS/types"

/** List of all icons for block types */
export const blockTypeIcons:{[key:string]:any} = {
    input:"🔍",text:"📝",stringList:"📋",number:"🔢",date:"📅",boolean:"✅",json:"📋",file:"📄",files:"📂",linkRoute:"🔗",editor:"📝",slug:"🌎",keyObjectList:"📋",objectList:"📋"
}

type ColNames = AppCollectionNames | "create" | "update" | "objects"
/** List of collection needed for cms */
export const appCollectionNames:ColNames[] = [ "_App","_Assets","_Sessions","create","update","objects" ]

/** List of all block types */
export const blockTypes:RouteBlockTypes[] = ["input","slug","text","number","date","boolean","stringList","objectList","keyObjectList","file","files","linkRoute","editor"]

/** List of asset providers */
export const assetProvidersNames:AssetProvidersNames[] = [ "cloudinary","test" ]

/** List of asset providers, can you this data as template */
export const assetProvidersTemplate:{[key in AssetProvidersNames]:AssetProviders} = {
    cloudinary:{
        name:"cloudinary",
        cloudName:"",
        apiKey:"",
        apiSecretKey:""
    },
    test:{
        name:"test",
        testCloud:"",
        url:""
    }
}