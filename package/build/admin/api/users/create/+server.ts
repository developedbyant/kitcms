import db from 'svelteCMS/lib/db.server';
import { json } from '@sveltejs/kit';
import Auth from 'svelteCMS/lib/auth.server';
import type { ApiUserCreate } from 'svelteCMS/types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
    const jsonInputData:ApiUserCreate['input'] = await event.request.json()
    const auth = new Auth(db)
    const newUserData = await auth.register(event,jsonInputData,false)
    // If user was not created
    if(!newUserData){
        const response:ApiUserCreate['output'] = {
            error:true,
            message:`User with email:${jsonInputData.email} exist`
        } 
        return json(response)
    }
    // else if user was created
    const response:ApiUserCreate['output'] = {
        error:false,
        message:`New user created: ${jsonInputData.email}`,
        data:newUserData.userData
    } 
    return json(response)
};