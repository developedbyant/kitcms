import db from "mdbCMS/lib/db.server";

type Config = { limit?:number,skip?:number }

type Filter<Data> = {[key in keyof Data]:any}|{}

type TagsData = {
    title:string
    slug:string
    views:number
    createdAt:Date
    updatedAt:Date
}
type CategoriesData = {
    title:string
    slug:string
    views:number
    createdAt:Date
    updatedAt:boolean
    image:import("mdbCMS/types").AssetData
}
type PostsData = {
    title:string
    slug:string
    public:boolean
    createdAt:Date
    updatedAt:Date
    thumbnail:import("mdbCMS/types").AssetData
    images:import("mdbCMS/types").AssetData[]
    seoTitle:string
    seoDesc:string
    tags:TagsData[]
    categories:CategoriesData[]
}

export default class Fetcher {
    async tag<K extends keyof TagsData>(filter:Filter<TagsData>,select:{[P in K]:true|{[key:string]:any}}){
            const object = await db.collection("tags").findOne(filter,{ projection:select }) as any ;
            object['_id']=object['_id'].toString()
            const response = object as Pick<TagsData, K> & { _id:string }
            return response
        }
        async tags<K extends keyof TagsData>(filter:Filter<TagsData>,select:{[P in K]:true|{[key:string]:any}},config?:Config){
            type Response = Pick<TagsData, K> & { _id:string }
            const cursor = db.collection("tags").find(filter,{ projection:select }).map(((data:any)=>{ data['_id']=data['_id'].toString() ; return data}))
            if(config?.skip) cursor.skip(config.skip)
            if(config?.limit) cursor.limit(config.limit)
            const response = await cursor.toArray() as Response[]
            return response
        }
    async categorie<K extends keyof CategoriesData>(filter:Filter<CategoriesData>,select:{[P in K]:true|{[key:string]:any}}){
            const object = await db.collection("categories").findOne(filter,{ projection:select }) as any ;
            object['_id']=object['_id'].toString()
            const response = object as Pick<CategoriesData, K> & { _id:string }
            return response
        }
        async categories<K extends keyof CategoriesData>(filter:Filter<CategoriesData>,select:{[P in K]:true|{[key:string]:any}},config?:Config){
            type Response = Pick<CategoriesData, K> & { _id:string }
            const cursor = db.collection("tags").find(filter,{ projection:select }).map(((data:any)=>{ data['_id']=data['_id'].toString() ; return data}))
            if(config?.skip) cursor.skip(config.skip)
            if(config?.limit) cursor.limit(config.limit)
            const response = await cursor.toArray() as Response[]
            return response
        }
    async post<K extends keyof PostsData>(filter:Filter<PostsData>,select:{[P in K]:true|{[key:string]:any}}){
            const object = await db.collection("posts").findOne(filter,{ projection:select }) as any ;
            object['_id']=object['_id'].toString()
            const response = object as Pick<PostsData, K> & { _id:string }
            return response
        }
        async posts<K extends keyof PostsData>(filter:Filter<PostsData>,select:{[P in K]:true|{[key:string]:any}},config?:Config){
            type Response = Pick<PostsData, K> & { _id:string }
            const cursor = db.collection("tags").find(filter,{ projection:select }).map(((data:any)=>{ data['_id']=data['_id'].toString() ; return data}))
            if(config?.skip) cursor.skip(config.skip)
            if(config?.limit) cursor.limit(config.limit)
            const response = await cursor.toArray() as Response[]
            return response
        }
}