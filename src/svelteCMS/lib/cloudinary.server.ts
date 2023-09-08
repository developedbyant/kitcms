import { v2 as CloudinaryApi } from "cloudinary"
import type { AssetLoad } from "svelteCMS/types"

export default class Cloudinary {

    constructor(private cloudName:string,private apiKey:string,private apiSecretKey:string){
        this.cloudName = cloudName
        this.apiKey = apiKey
        this.apiSecretKey = apiSecretKey
        CloudinaryApi.config({
            cloud_name:cloudName,
            api_key:apiKey,
            api_secret:apiSecretKey
        })
    }

    /** Upload form file */
    async uploadFormFile(file:File,assetName?:string){
        const apiUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`
        const newFormData = new FormData()
        // Create a timestamp for the signature
        const timestamp = Math.round(new Date().getTime() / 1000).toString()
        // Set the upload preset and any other parameters you want to include in the request
        const params = { timestamp, upload_preset: 'ml_default' }
        // Generate the signature using the Cloudinary SDK's sign_request() method
        const signature = CloudinaryApi.utils.sign_request(params, { api_secret:this.apiSecretKey });
        newFormData.append("file",file)
        newFormData.append("upload_preset","ml_default")
        newFormData.append("timestamp",timestamp)
        newFormData.append("signature",signature.signature)
        newFormData.append("api_key",this.apiKey)
        const cloudinaryResp = await fetch(apiUrl,{
            method:"POST",
            body:newFormData
        })
        const apiResponse = await cloudinaryResp.json()
        const response:AssetLoad = {
            id: apiResponse.public_id,
            provider: "cloudinary",
            src: apiResponse.secure_url,
            title: assetName?assetName:apiResponse.original_filename,
            type: apiResponse.resource_type,
            extension: apiResponse.format
        }
        return response
    }

    /** Upload file */
    async uploadFile(filePath:string,assetName?:string){
        const apiResponse = await CloudinaryApi.uploader.upload(filePath)
        const response:AssetLoad = {
            id: apiResponse.public_id,
            provider: "cloudinary",
            src: apiResponse.secure_url,
            title: assetName?assetName:apiResponse.original_filename,
            type: apiResponse.resource_type,
            extension: apiResponse.format
        }
        return response
    }
    
    /** Remove/Delete file */
    async deleteFile(publicID:string){
        const response = await CloudinaryApi.uploader.destroy(publicID)
        return response.result==="ok"
    }
    /** Search files */
    async searchFile(expression:string){
        const response = CloudinaryApi.search.expression(expression)
        return response.execute()
    }
}