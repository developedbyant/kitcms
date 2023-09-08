import db from 'svelteCMS/lib/db.server';
import { json } from '@sveltejs/kit';
import { ObjectId } from "mongodb"
import type { ApiUserDelete } from 'svelteCMS/types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
    const jsonInputData:ApiUserDelete['input'] = await event.request.json()
    // check if user exists
    const usersCol = db.collection("_Users")
    const filter = { _id:new ObjectId(jsonInputData._id)}
    const userDataBD = await usersCol.findOne(filter)
    if(!userDataBD){
        const response:ApiUserDelete['output'] = {
            error:true,
            message:`User with id: ${jsonInputData._id} not founded`
        } 
        return json(response)
    }
    // delete user
    const deleteRes = await usersCol.deleteOne(filter)
    // if user was deleted
    if(deleteRes.acknowledged){
        // return response
        const response:ApiUserDelete['output'] = {
            error:false,
            message:`User was deleted`,
            data:jsonInputData
        } 
        return json(response)
    }
    // return error
    const response:ApiUserDelete['output'] = {
        error:true,
        message:"Something went wrong"
    } 
    return json(response)
};