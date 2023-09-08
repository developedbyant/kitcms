<script lang="ts">
    import { goto } from "$app/navigation";
    import utils from "svelteCMS/lib/utils";
    import { createToast } from "svelteCMS/components/toasts/store";
    import UserViewer from "svelteCMS/components/shared/UserViewer.svelte";
    import type { ApiUserCreate } from "svelteCMS/types";
    let userData = {
        role:"editor",firstName:"",lastName:"",
        email: "",password: "",createdAt:new Date,image:null
    }
    let loading:boolean = false

    /** create new user */
    async function createUser() {
        // validate inputs, if not validated show error message and stop func
        const validatorErrors = utils.validateInputs(userData)
        if(validatorErrors.length>0) createToast({ type:"error",msg:validatorErrors[0].message })
        // else create user
        else{
            const apiLoad:ApiUserCreate['input'] = userData
            const apiResponse:ApiUserCreate['output'] = await utils.apiRequest("/admin/api/users/create",apiLoad)
            // show api response
            createToast({ type:apiResponse.error?"error":"successful",msg:apiResponse.message })
            // wait 1 second to show message
            await utils.wait(500)
            // if user was created go to editor page
            if(!apiResponse.error) goto("/admin/users")
        }
        await utils.wait(500)
        loading = false
    }
</script>
<UserViewer bind:userData bind:loading on:create={createUser}/>