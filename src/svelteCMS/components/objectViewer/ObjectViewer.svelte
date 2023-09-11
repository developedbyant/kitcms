<script lang="ts">
    export let isNewObject:boolean = true
    export let objectData:ObjectData = {}
    export let routeData:RouteLoad|RouteData
    import utils from "svelteCMS/lib/utils";
    import { createToast } from "svelteCMS/components/toasts/store";
    import { goto } from "$app/navigation";
    import PageTitle from "svelteCMS/components/shared/PageTitle.svelte";
    import Content from "svelteCMS/components/layout/Content.svelte";
    import LeftContent from "svelteCMS/components/layout/LeftContent.svelte";
    import RightContent from "svelteCMS/components/layout/RightContent.svelte";
    import LeftInputs from "./LeftInputs.svelte";
    import RightInputs from "./RightInputs.svelte";
    import Button from "svelteCMS/components/shared/Button.svelte";
    // icons
    import PlusIcon from "svelteCMS/icons/Plus.svelte";
    import CloudIcon from "svelteCMS/icons/Cloud.svelte"
    import type { ApiObjectCreate, ApiObjectUpdate, RouteBlockData, RouteData,RouteLoad,ObjectData } from "svelteCMS/types";
    let routeID = routeData.id
    /** indicate if create or update button was clicked */
    let submitting = false
    let checkInputErrors = isNewObject ? false : true
    // Add default value to blocks when adding new object
    if(isNewObject){
        for(const blockData of routeData.blocks){
            objectData[blockData.id] = utils.getBlockDefaultValue(blockData)
        }
    }
    
    /** Submit changes */
    async function submit(){
        submitting = true
        checkInputErrors = true
        const validatorErrors = utils.validateInputs(objectData)
        // if any errors were returned from validator, show toast and stop function
        if(validatorErrors.length>0){
            createToast({ type:"error",msg:validatorErrors[0].message})
            submitting = false ; return
        }
        // create or update object
        // create object
        if(isNewObject){
            const apiLoad:ApiObjectCreate['input'] = { routeID,objectData }
            const apiResponse:ApiObjectCreate['output'] = await utils.apiRequest("/admin/api/objects/create",apiLoad)
            // wait 5 milliseconds to show toast
            await utils.wait(500)
            createToast({ type:apiResponse.error?"error":"successful",msg:apiResponse.message })
            // if object was create go to editing page
            if(!apiResponse.error){
                // wait 2 seconds to navagate to admin home page
                await utils.wait(1000)
                const objectID = apiResponse.data._id
                goto(`/admin/routes/${routeID}/objects/create`,{ replaceState:true })
            }
        }
        // update object
        else{
            const apiLoad:ApiObjectUpdate['input'] = { routeID,objectData }
            const apiResponse:ApiObjectUpdate['output'] = await utils.apiRequest("/admin/api/objects/update",apiLoad)
            // wait 5 milliseconds to show toast
            await utils.wait(500)
            createToast({ type:apiResponse.error?"error":"successful",msg:apiResponse.message })
        }
        submitting = false
    }

    /** Generate slug if user click generate button on slug type label's button */
    function genSlug(e:any){
        const blockData:RouteBlockData = e.detail
        const blockWithInputType = routeData.blocks.find(data=>data.type==="input")
        // if block with input type was founded and that block has any text, use it to generate slug
        if(blockWithInputType && objectData[blockWithInputType.id]){
            objectData[blockData.id] = utils.generateSlug(objectData[blockWithInputType.id])
        }
    }
</script>

<!-- <code>
    <pre>{JSON.stringify(objectData,null,4)}</pre>
</code> -->

<PageTitle showGoBack title={`${isNewObject?"Adding":"Updating"} ${routeID}`} link={{ text:"View all",href:`/admin/routes/${routeData.id}`}}/>
<Content>
    <LeftContent>
        {#each routeData.blocks as blockData }
            <LeftInputs {checkInputErrors} {blockData} bind:value={objectData[blockData.id]} on:genSlug={genSlug}/>
        {/each}
    </LeftContent>
    <RightContent>
        {#each routeData.blocks as blockData }
            <RightInputs {blockData} bind:value={objectData[blockData.id]}/>
        {/each}
        <Button loading={submitting} text={isNewObject?"Add":"Update"} icon={isNewObject?PlusIcon:CloudIcon} on:click={submit}/>
    </RightContent>
</Content>