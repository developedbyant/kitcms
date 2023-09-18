import slugify from "slugify"
import type { ApiEndpoints, RouteBlockData } from "svelteCMS/types"

export default new class Utils {
    test(){
        console.log("Utils client")
    }
    
    swapArrayIndex(arrayData:any[],itemOne:number, itemTow:number) {
        const temp = arrayData[itemOne];
        arrayData[itemOne] = arrayData[itemTow];
        arrayData[itemTow] = temp;
        return arrayData
    }

    /** Generate slug from string */
    generateSlug(data:string){
        return slugify(data,{strict:true,lower:true})
    }

    /** Get the default value for given block */
    getBlockDefaultValue(blockData:RouteBlockData){
        const blockType = blockData.type
        if(blockType==="input" || blockType==="text") return ""
        else if(blockType==="stringList" || blockType==="keyObjectList" || blockType==="objectList") return []
        else if(blockType==="number") return 1
        else if(blockType==="date") return new Date()
        else if(blockType==="boolean") return true
        else if(blockType==="file") return null
        else if(blockType==="files") return []
        else if(blockType==="linkRoute" && blockData.link?.oneToMany) return []
        else if(blockType==="linkRoute") return null
        else if(blockType==="editor") return { time:Date.now(),blocks:[] }
    }

    /** Swap index from a list */
    swapIndex(list:any[],useKey:string,idOne:string,idTwo:string){
        const idOneData = list.find(data=>data[useKey]===idOne)
        const idOneIndex = list.findIndex(data=>data[useKey]===idOne)
        const idTwoIndex = list.findIndex(data=>data[useKey]===idTwo)
        list[idOneIndex] = list[idTwoIndex]
        list[idTwoIndex] = idOneData
        return list
    }

    /** Wait for given time */
    wait(milliseconds:number){ return new Promise(r=>setTimeout(r,milliseconds))}

    /** Make api request */
    async apiRequest(apiUrl:ApiEndpoints,apiLoad:{[key:string]:any}|FormData) {
        const isAFile = apiLoad instanceof FormData        
        const requestHeaders = isAFile ? {} : { "Content-Type":"application/json" } as any        
        const requestBody = isAFile ? apiLoad : JSON.stringify(apiLoad)
        const request = await fetch(apiUrl,{
            method:"POST",
            headers:requestHeaders,
            body:requestBody
        })
        return request.json()
    }

    /** Validate object inputs */
    validateInputs(data:{[key:string]:any}){
        const errors:{key:string,message:string}[] = []
        const entries = Object.entries(data)
        // loop all keys and values
        for(const [key,value] of entries){
            const type = typeof value
            // on string
            if(type==="string" && value.trim()===""){
                errors.push({ key,message:`${key} can not be empty` })
                // errors.push({ key,message:`key:${key} can not be empty` })
            }
            // on date
            else if(value instanceof Date) continue
            // on array
            else if(value instanceof Array && value.length===0){
                errors.push({ key,message:`${key} can not be empty` })
            }
            // on object
            else if(value instanceof Object && Object.entries(value).length===0){
                errors.push({ key,message:`${key} can not be empty` })
            }
            // null
            else if(value===null){
                errors.push({ key,message:`${key} can not be null` })
            }
        }
        return errors
    }

    /** Email validator */
    emailValidator(data:string){
        const result = data.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
        return result===null ? false : result.length>0
    }
}