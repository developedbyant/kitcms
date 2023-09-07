/** Middleware
 * @type { import("./src/mdbCMS/types").MiddlewareFunc }
 * @param { import("@sveltejs/kit").RequestEvent } event */
async function demoFunc(event){
    const jsonData = await event.request.clone().json()
    return {
        error:true,
        message:"This is just a demo, you're not allow to do that :)",
    }
}

/** @type {import("./src/mdbCMS/types").ConfigFile } */
export default {
    middleWares:{
        "/admin/api/providers/delete":[demoFunc],
        "/admin/api/assets/delete":[demoFunc],
        "/admin/api/users/delete":[async(event)=>{
            /** @type {import("./src/mdbCMS/types").ApiUserDelete['input'] } */
            const jsonData = await event.request.clone().json()
            if(jsonData.email==="admin@sveltecms.dev"){
                return {
                    error:true,
                    message:"Not allow to delete admin@cms.com on demo",
                }
            }
            return {
                error:false,
                message:"This is just a demo, you're not allow to do that :)"
            }
        }]
    }
}