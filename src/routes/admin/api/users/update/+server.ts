import db from 'mdbCMS/lib/db.server';
import { json } from '@sveltejs/kit';
import { ObjectId } from "mongodb"
import type { ApiUserUpdate } from 'mdbCMS/types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
    const jsonInputData:ApiUserUpdate['input'] = await event.request.json()
    // check if user exists
    const usersCol = db.collection("_Users")
    const filter = { _id:new ObjectId(jsonInputData._id)}
    const userDataBD = await usersCol.findOne(filter)
    if(!userDataBD){
        const response:ApiUserUpdate['output'] = {
            error:true,
            message:`User with id: ${jsonInputData._id} not founded`
        } 
        return json(response)
    }
    // update user
    const setData:{[key:string]:any} = { ...jsonInputData }
    delete setData['_id'] // remove _id since it can not be set
    const updateRes = await usersCol.updateOne(filter,{$set:setData})
    // if user was updated
    if(updateRes.acknowledged){
        const response:ApiUserUpdate['output'] = {
            error:false,
            message:`User was updated`,
            data:jsonInputData
        } 
        return json(response)
    }
    // return error
    const response:ApiUserUpdate['output'] = {
        error:true,
        message:"Something went wrong"
    } 
    return json(response)
};