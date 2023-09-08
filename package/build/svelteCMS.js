/** Demo Middleware
 * @type { import("./src/svelteCMS/types").MiddlewareFunc }
 * @param { import("@sveltejs/kit").RequestEvent } event */
async function demoFunc(event){
    const jsonData = await event.request.clone().json()
    return {
        error:true,
        message:"This is a demo Middleware edit or remove me in ./svelteCMS.js",
    }
}

/** @type {import("./src/svelteCMS/types").ConfigFile } */
export default {
    middleWares:{
        "/admin/api/providers/delete":[demoFunc],
    }
}