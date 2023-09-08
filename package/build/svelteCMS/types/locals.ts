export type Locals = {
    userData:import("svelteCMS/types").UserData
    routes:import("svelteCMS/types").RouteData[]
    appData:{
        assetProvider:import("svelteCMS/types").AssetProvidersNames|undefined
        usersPerPage:number
        assetsPerPage:number
        routesPerPage:number
        objectsPerPage:number
    }
}

export type PageData = {
    userData:import("svelteCMS/types").UserData
    routes:import("svelteCMS/types").RouteData[]
    theme:"dark"|"light"
    appData:{
        assetProvider:import("svelteCMS/types").AssetProvidersNames|undefined
        usersPerPage:number
        assetsPerPage:number
        routesPerPage:number
        objectsPerPage:number
    }
}