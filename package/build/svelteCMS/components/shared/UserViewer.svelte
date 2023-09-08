<script lang="ts">
    export let userData:UserLoad|UserData 
    export let isNewUser:boolean = true
    export let loading:boolean = false
    import { createEventDispatcher } from "svelte";
    import utils from "svelteCMS/lib/utils";
    import { createToast } from "svelteCMS/components/toasts/store";
    import FileSelector from "svelteCMS/components/shared/FileSelector.svelte";
    import PageTitle from "svelteCMS/components/shared/PageTitle.svelte";
    import Content from "svelteCMS/components/layout/Content.svelte";
    import LeftContent from "svelteCMS/components/layout/LeftContent.svelte";
    import RightContent from "svelteCMS/components/layout/RightContent.svelte";
    import Button from "svelteCMS/components/shared/Button.svelte";
    import Label from "svelteCMS/components/shared/Label.svelte";
    import LabelSelector from "svelteCMS/components/shared/LabelSelector.svelte";
    import Input from "svelteCMS/components/input/Input.svelte";
    import AssetPreview from "svelteCMS/components/shared/AssetPreview.svelte";
    import type { AssetData, UserData, UserLoad } from "svelteCMS/types";
    const dispatch = createEventDispatcher()
    let checkInputs:boolean = false
    let showFileSelector:boolean = false
    let setNewPass:boolean = false

    /** send custom event when user click create or update button */
    function handleSubmit(){
        loading = true
        checkInputs = true
        // check for email
        if(!utils.emailValidator(userData.email)){
            createToast({ type:"error",msg:"Please check email field"})
            loading = false
        }
        // else send event
        else{
            if(isNewUser) dispatch("create")
            else dispatch("update")
        }
    }

    /** set user image with whatever asset user selected */
    function handleFileSelector(e:any){
        const asset:AssetData = e.detail
        userData.image = asset
    }
</script>

<PageTitle showGoBack title={isNewUser?"Creating user":"Updating user"}/>
<FileSelector bind:open={showFileSelector} on:selected={handleFileSelector}/>
<Content>
    <LeftContent>
        <Input bind:value={userData.firstName} placeholder="First name..." type="input" error={checkInputs && !userData.firstName.trim()}/>
        <Input bind:value={userData.lastName} placeholder="Last name..." type="input" error={checkInputs && !userData.lastName.trim()}/>
        <Input bind:value={userData.email} placeholder="Email..." type="email" error={checkInputs && (!userData.email.trim() || !utils.emailValidator(userData.email))}/>
        <!-- only show when creating new user -->
        {#if isNewUser}
            <Input bind:value={userData.password} placeholder="Password..." type="password" error={checkInputs && !userData.password.trim()}/>
        {:else if !setNewPass}
            <Button full={false} text="Set new password?" on:click={()=>{ userData.password="";setNewPass=true }}/>
        {:else if setNewPass}
            <Input bind:value={userData.password} placeholder="Password..." type="password" error={checkInputs && !userData.password.trim()}/>
        {/if}
    </LeftContent>
    <RightContent>
        <LabelSelector bind:value={userData.role} text="Role" options={["admin","user","editor"]}/>
        <Label text="Profile image" btn={userData.image?"Update":"Select"} on:click={()=>showFileSelector=true}/>
        {#if userData.image}
            <AssetPreview asset={userData.image}/>
        {/if}
        <Button bind:loading text={isNewUser?"Create":"Update"} on:click={handleSubmit}/>
    </RightContent>
</Content>