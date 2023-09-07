export type Locals = {
    userData:import("mdbCMS/types").UserData
    routes:import("mdbCMS/types").RouteData[]
    appData:{
        assetProvider:import("mdbCMS/types").AssetProvidersNames|undefined
        usersPerPage:number
        assetsPerPage:number
        routesPerPage:number
        objectsPerPage:number
    }
}

export type PageData = {
    userData:import("mdbCMS/types").UserData
    routes:import("mdbCMS/types").RouteData[]
    theme:"dark"|"light"
    appData:{
        assetProvider:import("mdbCMS/types").AssetProvidersNames|undefined
        usersPerPage:number
        assetsPerPage:number
        routesPerPage:number
        objectsPerPage:number
    }
}