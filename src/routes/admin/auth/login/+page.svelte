<script lang="ts">
    import Form from "../Form.svelte";
    import Input from "svelteCMS/components/input/Input.svelte";
    import Button from "svelteCMS/components/shared/Button.svelte";
    import utils from "svelteCMS/lib/utils";
    import { createToast } from "svelteCMS/components/toasts/store";
    import type { ApiUserLogin } from "svelteCMS/types";
    let loading:boolean = false
    let email:string = ""
    let password:string = ""

    /** Login */
    async function login() {
        loading = true
        // validate inputs
        const validated = inputValidator()
        if(validated.error){
            createToast({ type:"error",msg:validated.message })
            loading = false ; return
        }
        // send request
        const apiLoad:ApiUserLogin['input'] = { email,password }
        const apiResponse:ApiUserLogin['output'] = await utils.apiRequest("/admin/api/users/login",apiLoad)
        createToast({ type:apiResponse.error ? "error" : "successful",msg:apiResponse.message })
        // wait 1 second
        await utils.wait(500)
        // go to admin page
        if(!apiResponse.error) location.href = "/admin"
        loading = false
    }

    /** Validate inputs */
    function inputValidator(){
        const cleanEmail = email.trim()
        const cleanPassword = password.trim()
        if(cleanEmail==="") return{ error:true,message:"Please enter email"}
        else if(cleanPassword==="") return{ error:true,message:"Please enter password"}
        return {
            email:cleanEmail,
            password:cleanPassword,
        }
    }
</script>

<Form>
    <svelte:fragment slot="formData">
        <Input bind:value={email} type="email" placeholder="Email..." rounded/>
        <Input bind:value={password} type="password" placeholder="Password..." rounded/>
        <Button {loading} text="Login" on:click={login} />
    </svelte:fragment>
</Form>