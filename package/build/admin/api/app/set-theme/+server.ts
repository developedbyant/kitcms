import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { ApiSetTheme } from "svelteCMS/types"

export const POST: RequestHandler = async (event) => {
    const currentTheme = event.cookies.get("theme") || "dark"
    const newTheme = currentTheme==="dark" ? "light" : "dark"
    // set theme
    event.cookies.set("theme",newTheme,{
        path:"/",
        httpOnly:true,
        sameSite:"strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 26 * 30
    })
    const response:ApiSetTheme['output'] = {
        error:false,
        message:"Theme was set",
        data:{ theme:newTheme }
    }
    return json(response);
};