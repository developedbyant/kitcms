import type * as GeneratedTypes from "svelteCMS/types/generated";
import db from "svelteCMS/lib/db.server";

type Config<TYPE> = { limit?:number,skip?:number,sort?:{ key: (keyof TYPE), direction:"desc"|"asc" } }

type Filter<Data> = {[key in keyof Data]:any}|{}

export default class Fetcher {
    async tag<K extends keyof GeneratedTypes.TagsData>(filter:Filter<GeneratedTypes.TagsData>,select:{[P in K]:true|{[key:string]:any}}){
            const object = await db.collection("tags").findOne(filter,{ projection:select }) as any ;
            if(object) object['_id']=object['_id'].toString()
            const response = object as Pick<GeneratedTypes.TagsData, K> & { _id:string }
            return response
        }
        async tags<K extends keyof GeneratedTypes.TagsData>(filter:Filter<GeneratedTypes.TagsData>,select:{[P in K]:true|{[key:string]:any}},config?:Config<GeneratedTypes.TagsData>){
            type Response = Pick<GeneratedTypes.TagsData, K> & { _id:string }
            const cursor = db.collection("tags").find(filter,{ projection:select }).map(((data:any)=>{ data['_id']=data['_id'].toString() ; return data}))
            if(config?.skip) cursor.skip(config.skip)
            if(config?.sort) cursor.sort(config.sort.key,config.sort.direction)
            if(config?.limit) cursor.limit(config.limit)
            const response = await cursor.toArray() as Response[]
            return response
        }
    async category<K extends keyof GeneratedTypes.CategoriesData>(filter:Filter<GeneratedTypes.CategoriesData>,select:{[P in K]:true|{[key:string]:any}}){
            const object = await db.collection("categories").findOne(filter,{ projection:select }) as any ;
            if(object) object['_id']=object['_id'].toString()
            const response = object as Pick<GeneratedTypes.CategoriesData, K> & { _id:string }
            return response
        }
        async categories<K extends keyof GeneratedTypes.CategoriesData>(filter:Filter<GeneratedTypes.CategoriesData>,select:{[P in K]:true|{[key:string]:any}},config?:Config<GeneratedTypes.CategoriesData>){
            type Response = Pick<GeneratedTypes.CategoriesData, K> & { _id:string }
            const cursor = db.collection("categories").find(filter,{ projection:select }).map(((data:any)=>{ data['_id']=data['_id'].toString() ; return data}))
            if(config?.skip) cursor.skip(config.skip)
            if(config?.sort) cursor.sort(config.sort.key,config.sort.direction)
            if(config?.limit) cursor.limit(config.limit)
            const response = await cursor.toArray() as Response[]
            return response
        }
    async product<K extends keyof GeneratedTypes.ProductsData>(filter:Filter<GeneratedTypes.ProductsData>,select:{[P in K]:true|{[key:string]:any}}){
            const object = await db.collection("products").findOne(filter,{ projection:select }) as any ;
            if(object) object['_id']=object['_id'].toString()
            const response = object as Pick<GeneratedTypes.ProductsData, K> & { _id:string }
            return response
        }
        async products<K extends keyof GeneratedTypes.ProductsData>(filter:Filter<GeneratedTypes.ProductsData>,select:{[P in K]:true|{[key:string]:any}},config?:Config<GeneratedTypes.ProductsData>){
            type Response = Pick<GeneratedTypes.ProductsData, K> & { _id:string }
            const cursor = db.collection("products").find(filter,{ projection:select }).map(((data:any)=>{ data['_id']=data['_id'].toString() ; return data}))
            if(config?.skip) cursor.skip(config.skip)
            if(config?.sort) cursor.sort(config.sort.key,config.sort.direction)
            if(config?.limit) cursor.limit(config.limit)
            const response = await cursor.toArray() as Response[]
            return response
        }
    async test<K extends keyof GeneratedTypes.TestsData>(filter:Filter<GeneratedTypes.TestsData>,select:{[P in K]:true|{[key:string]:any}}){
            const object = await db.collection("tests").findOne(filter,{ projection:select }) as any ;
            if(object) object['_id']=object['_id'].toString()
            const response = object as Pick<GeneratedTypes.TestsData, K> & { _id:string }
            return response
        }
        async tests<K extends keyof GeneratedTypes.TestsData>(filter:Filter<GeneratedTypes.TestsData>,select:{[P in K]:true|{[key:string]:any}},config?:Config<GeneratedTypes.TestsData>){
            type Response = Pick<GeneratedTypes.TestsData, K> & { _id:string }
            const cursor = db.collection("tests").find(filter,{ projection:select }).map(((data:any)=>{ data['_id']=data['_id'].toString() ; return data}))
            if(config?.skip) cursor.skip(config.skip)
            if(config?.sort) cursor.sort(config.sort.key,config.sort.direction)
            if(config?.limit) cursor.limit(config.limit)
            const response = await cursor.toArray() as Response[]
            return response
        }
    async cart<K extends keyof GeneratedTypes.CartsData>(filter:Filter<GeneratedTypes.CartsData>,select:{[P in K]:true|{[key:string]:any}}){
            const object = await db.collection("carts").findOne(filter,{ projection:select }) as any ;
            if(object) object['_id']=object['_id'].toString()
            const response = object as Pick<GeneratedTypes.CartsData, K> & { _id:string }
            return response
        }
        async carts<K extends keyof GeneratedTypes.CartsData>(filter:Filter<GeneratedTypes.CartsData>,select:{[P in K]:true|{[key:string]:any}},config?:Config<GeneratedTypes.CartsData>){
            type Response = Pick<GeneratedTypes.CartsData, K> & { _id:string }
            const cursor = db.collection("carts").find(filter,{ projection:select }).map(((data:any)=>{ data['_id']=data['_id'].toString() ; return data}))
            if(config?.skip) cursor.skip(config.skip)
            if(config?.sort) cursor.sort(config.sort.key,config.sort.direction)
            if(config?.limit) cursor.limit(config.limit)
            const response = await cursor.toArray() as Response[]
            return response
        }
}