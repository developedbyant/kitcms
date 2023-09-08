import Cloudinary from '../cloudinary.server';
import { writeFileSync } from "fs"
import type { RouteData } from 'svelteCMS/types';

export default new class Utils {
    Cloudinary = Cloudinary

    /** Email validator */
    emailValidator(data:string){
        const result = data.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
        return result===null ? false : result.length>0
    }
    /** generate route types and create fetch class */
    gen(routes:RouteData[]){
        let fetcherClass:string = `export default class Fetcher {`
        const types:string[] = []
        for(const route of routes){
            // add to fetch class
            fetcherClass+=this.fetchMethodTemplate(route.id,this.capitalize(route.id)+"Data")
            // start current route type data
            let typeData:string = `type ${this.capitalize(route.id)+"Data"} = {`
            // loop all blocks in current route
            for(const block of route.blocks){
                // string
                if(["input","slug","text"].includes(block.type)) typeData+=`\n    ${block.id}:string`
                // number
                else if(block.type==="number") typeData+=`\n    ${block.id}:number`
                // number
                else if(block.type==="date") typeData+=`\n    ${block.id}:Date`
                // boolean
                else if(block.type==="boolean") typeData+=`\n    ${block.id}:boolean`
                // file
                else if(block.type==="file") typeData+=`\n    ${block.id}:import("svelteCMS/types").AssetData`
                // files
                else if(block.type==="files") typeData+=`\n    ${block.id}:import("svelteCMS/types").AssetData[]`
                // linked route
                else if(block.type==="linkRoute"){
                    // one to many relation
                    if(block.link?.oneToMany) typeData+=`\n    ${block.id}:${this.capitalize(block.link.toRoute)}Data[]`
                    else typeData+=`\n    ${block.id}:${this.capitalize(block.link!.toRoute)}Data`
                }
            }
            // add route type
            types.push(typeData+"\n}")
        }
        // close class tag
        fetcherClass+="\n}"
        const fileData = `import db from "svelteCMS/lib/db.server";\n\ntype Config = { limit?:number,skip?:number }\n\ntype Filter<Data> = {[key in keyof Data]:any}|{}\n\n${types.join("\n")}\n\n${fetcherClass}`
        writeFileSync(`src/svelteCMS/lib/fetcher.server.ts`,fileData)
    }

    /** Capitalize string */
    private capitalize = (data:string)=> data.charAt(0).toUpperCase()+data.slice(1)

    /** template for fetcher methods */
    private fetchMethodTemplate = (routeID:string,typeName:string)=>`\n    async ${routeID.slice(0,routeID.length-1)}<K extends keyof ${typeName}>(filter:Filter<${typeName}>,select:{[P in K]:true|{[key:string]:any}}){
            const object = await db.collection("${routeID}").findOne(filter,{ projection:select }) as any ;
            object['_id']=object['_id'].toString()
            const response = object as Pick<${typeName}, K> & { _id:string }
            return response
        }
        async ${routeID}<K extends keyof ${typeName}>(filter:Filter<${typeName}>,select:{[P in K]:true|{[key:string]:any}},config?:Config){
            type Response = Pick<${typeName}, K> & { _id:string }
            const cursor = db.collection("tags").find(filter,{ projection:select }).map(((data:any)=>{ data['_id']=data['_id'].toString() ; return data}))
            if(config?.skip) cursor.skip(config.skip)
            if(config?.limit) cursor.limit(config.limit)
            const response = await cursor.toArray() as Response[]
            return response
        }`
}