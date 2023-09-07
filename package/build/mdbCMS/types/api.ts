import type { AssetData, AssetProviders, RouteData, RouteLoad, UserLoad,SettingsData, UserData } from "."

// API ENDPOINTS =============================================================
type ApiUsersEndpoints<Start extends string = "/admin/api/users"> = `${Start}/create` | `${Start}/update` | `${Start}/delete` | `${Start}/login`
type ApiRoutesEndpoints<Start extends string = "/admin/api/routes"> = `${Start}/create` | `${Start}/update` | `${Start}/delete`
type ApiObjectsEndpoints<Start extends string = "/admin/api/objects"> = `${Start}/search` | `${Start}/create` | `${Start}/update` | `${Start}/delete`
type ApiAssetsEndpoints<Start extends string = "/admin/api/assets"> = `${Start}/search` | `${Start}/upload` | `${Start}/upload-url` | `${Start}/update` | `${Start}/delete`
type ApiProvidersEndpoints<Start extends string = "/admin/api/providers"> = `${Start}/create` | `${Start}/delete` | `${Start}/set`
type ApiAppEndpoints<Start extends string = "/admin/api/app"> = `${Start}/update-settings` | `${Start}/set-theme`
type ApiOtherEndpoints<Start extends string = "/admin/api"> =  `${Start}/test` | `${Start}/test/file`
/** All api endpoints */
export type ApiEndpoints = ApiUsersEndpoints | ApiRoutesEndpoints | ApiOtherEndpoints | ApiObjectsEndpoints | ApiAssetsEndpoints | ApiProvidersEndpoints | ApiAppEndpoints

// API INPUTS AND OUTPUTS =============================================================
/** Test api */
export type ApiTest = ApiRequest<{},{}>
/** Set theme */
export type ApiSetTheme = ApiRequest<{},{ theme:"dark"|"light"}>
/** User login */
export type ApiUserLogin = ApiRequest<{ email:string,password:string },{ email:string }>
/** User create */
export type ApiUserCreate = ApiRequest<UserLoad,UserData>
/** User delete */
export type ApiUserDelete = ApiRequest<UserData,UserData>
/** User login */
export type ApiUserUpdate = ApiRequest<UserData,UserData>
/** Create new route */
export type ApiRouteCreate = ApiRequest<RouteLoad,RouteData>
/** Update route */
export type ApiRouteUpdate = ApiRequest<RouteLoad,RouteData>
/** Delete route */
export type ApiRouteDelete = ApiRequest<RouteLoad|RouteData,RouteData>
/** Search objects */
export type ApiObjectSearch = ApiRequest<{ routeID:string,query:{text:string,targetKey:string},limit:number },{[key:string]:any}[]>
/** Create objects */
export type ApiObjectCreate = ApiRequest<{ routeID:string,objectData:{[key:string]:any} },{[key:string]:any}>
/** Update objects */
export type ApiObjectUpdate = ApiRequest<{ routeID:string,objectData:{[key:string]:any} },{[key:string]:any}>
/** Delete objects */
export type ApiObjectDelete = ApiRequest<{ routeID:string,objectData:{[key:string]:any} },{[key:string]:any}>
/** Update setting */
export type ApiSettingUpdate = ApiRequest<SettingsData,SettingsData>

/** Set asset provider */
export type ApiSetAssetProvider = ApiRequest<AssetProviders,AssetProviders>
/** Delete asset provider */
export type ApiAssetProviderDelete = ApiRequest<{ name:string },{ name:string }>
/** Create asset provider */
export type ApiAssetProviderCreate = ApiRequest<AssetProviders,AssetProviders>
/** Set asset provider */
export type ApiAssetProviderSet = ApiRequest<{ name:string },{ name:string }>
/** Upload assets */
export type ApiAssetUpload = ApiRequest<FormData,AssetData>
/** Upload assets by url */
export type ApiAssetUploadUrl = ApiRequest<{ url:string,assetName:string },AssetData>
/** Search assets */
export type ApiAssetSearch = ApiRequest<{ query:string,limit:number },AssetData[]>
/** Delete assets */
export type ApiAssetDelete = ApiRequest<AssetData,AssetData>
/** Delete assets */
export type ApiAssetUpdate = ApiRequest<AssetData,AssetData>

// CORE =============================================================
/** Input and output for making request to /admin/api/* */
type ApiRequest<InputData,OutputData> = {
    input:InputData,
    output: {
        error:true
        message:string
    } | {
        error:false
        message:string
        data:OutputData
    }
}