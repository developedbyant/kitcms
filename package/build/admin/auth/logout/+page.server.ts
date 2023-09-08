import db from "svelteCMS/lib/db.server"
import Auth from "svelteCMS/lib/auth.server"
import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load:PageServerLoad = async(event)=>{
    const auth = new Auth(db)
    await auth.logout(event)
    throw redirect(302,"/admin/auth/login")
}