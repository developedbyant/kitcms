import db from 'mdbCMS/lib/db.server';
import { ObjectId } from 'mongodb';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { UserData } from 'mdbCMS/types';

export const load:PageServerLoad = async(event)=> {
    const userID = event.params.id
    const userDataDB = await db.collection("_Users").findOne({ _id:new ObjectId(userID) }) as UserData|null
    if(!userDataDB) throw error(404,`User not founded`)
    // @ts-ignore return user data
    userDataDB['_id'] = userDataDB['_id'].toString()
    return { userData:userDataDB }
}