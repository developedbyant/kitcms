import { redirect } from "@sveltejs/kit"

export const load = async(event)=>{
    const userData = event.locals.mdbCMS.userData
    console.log(event.locals.mdbCMS,"klk");
    // if user already logged in, redirect to /admin
    if(userData) throw redirect(302,"/admin")
}