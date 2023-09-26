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
        let updateClass:string = `export class Update {`
        let findClass:string = `export class Find {`
        let deleteClass:string = `export class Delete {`
        let insertClass:string = `export class Insert {`
        const types:string[] = []
        for(const route of routes){
            // add to classes
            findClass+=this.findMethodTemplate(route.id,route.singularID,this.capitalize(route.id)+"Data")
            updateClass+=this.updateMethodTemplate(route.id,route.singularID,this.capitalize(route.id)+"Data")
            deleteClass+=this.deleteMethodTemplate(route.id,route.singularID,this.capitalize(route.id)+"Data")
            insertClass+=this.insertMethodTemplate(route.id,route.singularID,this.capitalize(route.id)+"Data")
            // start current route type data
            let typeData:string = `export type ${this.capitalize(route.id)+"Data"} = {\n    _id:any`
            // loop all blocks in current route
            for(const block of route.blocks){
                // string
                if(["input","slug","text"].includes(block.type)) typeData+=`\n    ${block.id}:string`
                // number
                else if(block.type==="number") typeData+=`\n    ${block.id}:number`
                // string list
                else if(block.type==="stringList") typeData+=`\n    ${block.id}:string[]`
                // key object list
                else if(block.type==="keyObjectList") typeData+=`\n    ${block.id}:{key:string,value:string}[]`
                // key object list
                else if(block.type==="objectList"){
                    typeData+=`\n    ${block.id}:{ ${Object.entries(block.objectKeys!).map(data=>`${data[0]}:${data[1]}`).join(",")} }[]`
                }
                // date
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
        // close classes tag
        findClass+="\n}"
        updateClass+="\n}"
        deleteClass+="\n}"
        insertClass+="\n}"
        // save generated types
        writeFileSync(`src/svelteCMS/types/generated.ts`,types.join("\n"))

        const fileData = `import type * as GeneratedTypes from "svelteCMS/types/generated";\nimport db from "svelteCMS/lib/db.server";\n\ntype Config<TYPE> = { limit?:number,skip?:number,sort?:{ key: (keyof TYPE), direction:"desc"|"asc" } }\n\ntype Filter<Data> = {[key in keyof Data]:any}|{}\n\ntype SetData<TYPE> = { [K in keyof TYPE]?: TYPE[K] }\n\n${findClass}\n\n${updateClass}\n\n${deleteClass}\n\n${insertClass}`
        writeFileSync(`src/svelteCMS/lib/database.server.ts`,fileData+`\nexport default { Find:new Find,Update:new Update,Delete:new Delete,Insert:new Insert }`)
    }

    /** Capitalize string */
    private capitalize = (data:string)=> data.charAt(0).toUpperCase()+data.slice(1)

    /** template for fetcher methods */
    private findMethodTemplate = (routeID:string,singularID:string,typeName:string)=>`\n    async ${singularID}<K extends keyof GeneratedTypes.${typeName}>(filter:Filter<GeneratedTypes.${typeName}>,select?:{[P in K]:true|{[key:string]:any}}){
            const object = await db.collection("${routeID}").findOne(filter,{ projection:select }) as any ;
            if(object) object['_id']=object['_id'].toString()
            const response = object as typeof select extends undefined ? GeneratedTypes.${typeName} : Pick<GeneratedTypes.${typeName}, K> & { _id:string }
            return response
        }
        async ${routeID}<K extends keyof GeneratedTypes.${typeName}>(filter:Filter<GeneratedTypes.${typeName}>,select?:{[P in K]:true|{[key:string]:any}},config?:Config<GeneratedTypes.${typeName}>){
            type Response = typeof select extends undefined ? GeneratedTypes.${typeName} : Pick<GeneratedTypes.${typeName}, K> & { _id:string }
            const cursor = db.collection("${routeID}").find(filter,{ projection:select }).map(((data:any)=>{ data['_id']=data['_id'].toString() ; return data}))
            if(config?.skip) cursor.skip(config.skip)
            if(config?.sort) cursor.sort(config.sort.key,config.sort.direction)
            if(config?.limit) cursor.limit(config.limit)
            const response = await cursor.toArray() as Response[]
            return response
        }`

    /** template for setter methods */
    private updateMethodTemplate(routeID:string,singularID:string,typeName:string){
        return`\n    async ${singularID}(filter:Filter<GeneratedTypes.${typeName}>,dataToSet:SetData<GeneratedTypes.${typeName}>,){
        return db.collection("${routeID}").updateOne(filter,{$set:dataToSet})
    }\n    async ${routeID}(filter:Filter<GeneratedTypes.${typeName}>,dataToSet:SetData<GeneratedTypes.${typeName}>,){
        return db.collection("${routeID}").updateMany(filter,{$set:dataToSet})
    }`
    }

    /** template for delete methods */
    private deleteMethodTemplate(routeID:string,singularID:string,typeName:string){
        return`\n    async ${singularID}(filter:Filter<GeneratedTypes.${typeName}>){
        return db.collection("${routeID}").deleteOne(filter)
    }\n    async ${routeID}(filter:Filter<GeneratedTypes.${typeName}>){
        return db.collection("${routeID}").deleteMany(filter)
    }`
    }

    /** template for insert methods */
    private insertMethodTemplate(routeID:string,singularID:string,typeName:string){
        return`\n     async ${singularID}(data:Omit<GeneratedTypes.${typeName},"_id">){
            return db.collection("${routeID}").insertOne(data)
        }\n     async ${routeID}(data:Omit<GeneratedTypes.${typeName},"_id">[]){
            return db.collection("${routeID}").insertMany(data)
        }`
    }
}