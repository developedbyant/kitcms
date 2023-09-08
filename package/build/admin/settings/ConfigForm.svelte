<script lang="ts">
    export let updatingApp:boolean
    import { page } from "$app/stores";
    import { createEventDispatcher } from "svelte";
    import Label from "svelteCMS/components/shared/Label.svelte";
    import Button from "svelteCMS/components/shared/Button.svelte";
    import InputNumber from "svelteCMS/components/shared/InputNumber.svelte";
    const dispatch = createEventDispatcher();
    let checkForErrors:boolean = false
    const displayConfig = {
        assetsPerPage:$page.data.svelteCMS.appData.assetsPerPage,
        routesPerPage:$page.data.svelteCMS.appData.routesPerPage,
        objectsPerPage:$page.data.svelteCMS.appData.objectsPerPage,
        usersPerPage:$page.data.svelteCMS.appData.usersPerPage,
    }
</script>

<Label text="App configuration" margin="10px 0 0 0" btn="Reset"/>
<div class="form">
    <Label text="Routes per page" margin="0 0 0 0"/>       
    <InputNumber placeholder="Routes per page..." bind:value={displayConfig.routesPerPage} error={checkForErrors && !displayConfig.routesPerPage}/>
    <Label text="Assets per page" margin="0 0 0 0"/>       
    <InputNumber placeholder="Assets per page..." bind:value={displayConfig.assetsPerPage} error={checkForErrors && !displayConfig.assetsPerPage}/>
    <Label text="Objects per page" margin="0 0 0 0"/>       
    <InputNumber placeholder="Objects per page..." bind:value={displayConfig.objectsPerPage} error={checkForErrors && !displayConfig.objectsPerPage}/>
    <Label text="Users per page" margin="0 0 0 0"/>       
    <InputNumber placeholder="Users per page..." bind:value={displayConfig.usersPerPage} error={checkForErrors && !displayConfig.usersPerPage}/>
    <Button bind:loading={updatingApp} text="Save" on:click={()=>{ dispatch("saveDisplayConfig",displayConfig);checkForErrors=true }}/>
</div>

<style lang="scss">
    .form{
        padding: 20px;
        background-color: rgba(0,0,0,5%);
        border-radius: 5px;
        border: 1.5px solid var(--borderColor);
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
</style>