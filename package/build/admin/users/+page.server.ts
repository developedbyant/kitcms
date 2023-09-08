import db from 'svelteCMS/lib/db.server';
import type { UserData } from 'svelteCMS/types';
import type { PageServerLoad } from './$types';

export const load:PageServerLoad = async(event)=> {
    const userData = event.locals.svelteCMS.userData
    const appData = event.locals.svelteCMS.appData
    const pageNum = Number(event.url.searchParams.get("page")) || 1
    const skipNum = pageNum > 1 ? (pageNum * appData.usersPerPage) - appData.usersPerPage : 0
    const usersCol = db.collection("_Users")
    const query = event.url.searchParams.get("query")
    const filter = query ? { $and:[{email:new RegExp(query,"i")},{email:{$ne:userData.email}}] } : { email:{$ne:userData.email} }
    const cursor = usersCol.find(filter).limit(appData.usersPerPage?appData.usersPerPage:10).sort("_id","desc")
    const users:UserData[] = await cursor.map((data:any)=>{ data['_id'] = data['_id'].toString() ; return data }).skip(skipNum).toArray()
    // return users 
    return { users }
}