import { redirect } from "@sveltejs/kit"

export const load = async(event)=>{
    const userData = event.locals.svelteCMS.userData
    // if user already logged in, redirect to /admin
    if(userData) throw redirect(302,"/admin")
}