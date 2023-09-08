<script lang="ts">
    export let routeData:RouteLoad|RouteData
    /** if we adding new route or not */
    export let isNewRoute:boolean = true
    import utils from "svelteCMS/lib/utils";
    import { goto } from "$app/navigation";
    import { createToast } from "svelteCMS/components/toasts/store";
    import PageTitle from "svelteCMS/components/shared/PageTitle.svelte";
    import Content from "svelteCMS/components/layout/Content.svelte";
    import LeftContent from "svelteCMS/components/layout/LeftContent.svelte";
    import Input from "svelteCMS/components/shared/Input.svelte";
    import TextArea from "svelteCMS/components/shared/TextArea.svelte";
    import Label from "svelteCMS/components/shared/Label.svelte";
    import Button from "svelteCMS/components/shared/Button.svelte";
    import QuestionMark from "svelteCMS/components/shared/QuestionMark.svelte";
    import InputChips from "svelteCMS/components/inputChips/InputChips.svelte";
    import RouteBlocks from "svelteCMS/components/shared/RouteBlocks.svelte";
    import type { RouteLoad, RouteData, ApiRouteCreate, ApiRouteUpdate } from "svelteCMS/types";

    /** indicate if create or update button was clicked */
    let submitting = false
    let modalIsOpen = false
    let checkInputErrors = false
    $: errorOnKeys = {
        id:checkInputErrors && routeData.id.trim()==="",
        singularID:checkInputErrors && routeData.singularID.trim()==="",
        title:checkInputErrors && routeData.title.trim()==="",
        description:checkInputErrors && routeData.description.trim()==="",
        searchAbleKeys:checkInputErrors && routeData.searchAbleKeys.length===0,
        blocks:checkInputErrors && routeData.blocks.length===0
    }

    /** Submit changes */
    async function submit(){
        submitting = true
        checkInputErrors = true
        const validatorErrors = utils.validateInputs(routeData)
        // if any errors were returned from validator, show toast and stop function
        if(validatorErrors.length>0){
            createToast({ type:"error",msg:validatorErrors[0].message})
            submitting = false ; return
        }
        // create or update route
        // create route
        if(isNewRoute){
            const apiLoad:ApiRouteCreate['input'] = routeData
            const apiResponse:ApiRouteCreate['output'] = await utils.apiRequest("/admin/api/routes/create",apiLoad)
            createToast({ type:apiResponse.error?"error":"successful",msg:apiResponse.message })
            // if route was create go to home page
            if(!apiResponse.error){
                // wait 5 milliseconds to show toast
                await utils.wait(500)
                goto("/admin/routes",{ replaceState:true })
            }
        }
        // update route
        else{
            const apiLoad:ApiRouteUpdate['input'] = routeData
            const apiResponse:ApiRouteUpdate['output'] = await utils.apiRequest("/admin/api/routes/update",apiLoad)
            // wait 5 milliseconds to show toast
            await utils.wait(500)
            createToast({ type:apiResponse.error?"error":"successful",msg:apiResponse.message })
        }
        submitting = false
    }
</script>

<Content>
    <LeftContent>
        <PageTitle title={isNewRoute?"Create route":"Update route"} showGoBack link={{ text:"View routes",href:"/admin/routes"}}/>
        <!-- Only show route id when adding new route, not editing it -->
        {#if isNewRoute}
            <div class="flex">
                <div class="flex c">
                    <Label text="Plural id">
                        <QuestionMark text="Plural id example for posts for a list of posts"/>
                    </Label>
                    <Input bind:value={routeData.id} placeholder="Route id..." error={errorOnKeys.id}/>
                </div>
                <div class="flex c">
                    <Label text="Singular id">
                        <QuestionMark text="Singular id example for posts it will be post"/>
                    </Label>
                    <Input bind:value={routeData.singularID} placeholder="Singular route id..." error={errorOnKeys.singularID}/>
                </div>
            </div>
        {/if}
        <Input bind:value={routeData.title} placeholder="Route title..." error={errorOnKeys.title}/>
        <TextArea bind:value={routeData.description} placeholder="Route description..." error={errorOnKeys.description}/>
        <Label text="Target key to search">
            <QuestionMark text="Key use to search objects inside collection" />
        </Label>
        <InputChips bind:values={routeData.searchAbleKeys} error={errorOnKeys.searchAbleKeys} placeholder="Enter key to use when searching"/>
        <Label text="Route blocks" btn="Add" rounded on:pointerdown={()=>modalIsOpen=true}>
            <QuestionMark text="Blocks are the key/ or row of a collection or table" />
        </Label>
        <RouteBlocks bind:modalIsOpen bind:blocks={routeData.blocks} routeID={routeData.id}/>
        <Button text={isNewRoute?"Create":"Update"} on:click={submit} loading={submitting}/>
    </LeftContent>
</Content>

<style>
    .flex{
        flex: 1;
        display: flex;
        /* align-items: center; */
        gap: 10px;
        justify-content: space-between;
    }
    .flex.c{
        flex-direction: column;
    }
</style>