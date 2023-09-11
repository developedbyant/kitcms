import db from "svelteCMS/lib/db.server";

type Config<TYPE> = { limit?:number,skip?:number,sort?:{ key: (keyof TYPE), direction:"desc"|"asc" } }

type Filter<Data> = {[key in keyof Data]:any}|{}

type TagsData = {
    title:string
    slug:string
}
type CategoriesData = {
    title:string
    slug:string
    image:import("svelteCMS/types").AssetData
}

export default class Fetcher {
    async tag<K extends keyof TagsData>(filter:Filter<TagsData>,select:{[P in K]:true|{[key:string]:any}}){
            const object = await db.collection("tags").findOne(filter,{ projection:select }) as any ;
            if(object) object['_id']=object['_id'].toString()
            const response = object as Pick<TagsData, K> & { _id:string }
            return response
        }
        async tags<K extends keyof TagsData>(filter:Filter<TagsData>,select:{[P in K]:true|{[key:string]:any}},config?:Config<TagsData>){
            type Response = Pick<TagsData, K> & { _id:string }
            const cursor = db.collection("tags").find(filter,{ projection:select }).map(((data:any)=>{ data['_id']=data['_id'].toString() ; return data}))
            if(config?.skip) cursor.skip(config.skip)
            if(config?.sort) cursor.sort(config.sort.key,config.sort.direction)
            if(config?.limit) cursor.limit(config.limit)
            const response = await cursor.toArray() as Response[]
            return response
        }
    async category<K extends keyof CategoriesData>(filter:Filter<CategoriesData>,select:{[P in K]:true|{[key:string]:any}}){
            const object = await db.collection("categories").findOne(filter,{ projection:select }) as any ;
            if(object) object['_id']=object['_id'].toString()
            const response = object as Pick<CategoriesData, K> & { _id:string }
            return response
        }
        async categories<K extends keyof CategoriesData>(filter:Filter<CategoriesData>,select:{[P in K]:true|{[key:string]:any}},config?:Config<CategoriesData>){
            type Response = Pick<CategoriesData, K> & { _id:string }
            const cursor = db.collection("categories").find(filter,{ projection:select }).map(((data:any)=>{ data['_id']=data['_id'].toString() ; return data}))
            if(config?.skip) cursor.skip(config.skip)
            if(config?.sort) cursor.sort(config.sort.key,config.sort.direction)
            if(config?.limit) cursor.limit(config.limit)
            const response = await cursor.toArray() as Response[]
            return response
        }
}