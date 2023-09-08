import db from 'svelteCMS/lib/db.server';
import { json } from '@sveltejs/kit';
import Auth from 'svelteCMS/lib/auth.server';
import type { ApiUserLogin } from 'svelteCMS/types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
    const jsonInputData:ApiUserLogin['input'] = await event.request.json()
    const auth = new Auth(db)
    const loginRes = await auth.login(event,jsonInputData)
    // If user was not logged in
    if(!loginRes){
        const response:ApiUserLogin['output'] = {
            error:true,
            message:"Wrong email or password"
        } 
        return json(response)
    }
    // else if user was logged in
    const response:ApiUserLogin['output'] = {
        error:false,
        message:`Welcome back ${jsonInputData.email}`,
        data:{ email:jsonInputData.email }
    } 
    return json(response)
};