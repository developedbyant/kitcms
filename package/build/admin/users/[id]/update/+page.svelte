<script lang="ts">
    export let data:PageData
    import utils from "svelteCMS/lib/utils";
    import { goto } from "$app/navigation";
    import { createToast } from "svelteCMS/components/toasts/store";
    import UserViewer from "svelteCMS/components/shared/UserViewer.svelte";
    import type { ApiUserUpdate } from "svelteCMS/types";
    import type { PageData } from "./$types";
    let userData = data.userData
    let loading:boolean = false

    /** update new user */
    async function updateUser() {
        // validate inputs, if not validated show error message and stop func
        const validatorErrors = utils.validateInputs(userData)
        if(validatorErrors.length>0) createToast({ type:"error",msg:validatorErrors[0].message })
        // else update user
        else{
            const apiLoad:ApiUserUpdate['input'] = userData
            const apiResponse:ApiUserUpdate['output'] = await utils.apiRequest("/admin/api/users/update",apiLoad)
            // show api response
            createToast({ type:apiResponse.error?"error":"successful",msg:apiResponse.message })
            // wait 1 second to show message
            await utils.wait(500)
            // if user was updated go to editor page
            if(!apiResponse.error) goto(`/admin/users/${apiResponse.data._id}/update`)
        }
        await utils.wait(500)
        loading = false
    }
</script>

<UserViewer bind:userData bind:loading on:update={updateUser} isNewUser={false}/>