<script lang="ts">
    export let data:PageData
    import RouteObjects from "svelteCMS/components/routeObjects/RouteObjects.svelte";
    import utils from "svelteCMS/lib/utils";
    import { createToast } from "svelteCMS/components/toasts/store";
    import PageTitle from "svelteCMS/components/shared/PageTitle.svelte";
    import NoResult from "svelteCMS/components/shared/NoResult.svelte";
    import type { PageData } from "./$types";
    import type { ObjectData,ApiObjectDelete } from "svelteCMS/types";
    $: objects = data.objects
    $: routeID = data.routeData.id
    let deletingObjectID = ""

    /** Delete route object */
    async function deleteObject(e:any) {
        const objectData:ObjectData = e.detail
        // set deletingObjectID
        deletingObjectID = objectData._id
        // send api request
        const apiLoad:ApiObjectDelete['input'] = { objectData,routeID:data.routeData.id }
        const apiResponse:ApiObjectDelete['output'] = await utils.apiRequest("/admin/api/objects/delete",apiLoad)
        // wait 500 milliseconds
        await utils.wait(500)
        // show api response message
        createToast({ type:apiResponse.error?"error":"successful",msg:apiResponse.message })
        // wait 500 milliseconds
        await utils.wait(1000)
        // if object was delete, remove it from current list
        if(!apiResponse.error){
            const newObjects = objects.filter(data=>data._id!==objectData._id)
            objects = [...newObjects]
        }
        // remove deletingObjectID
        deletingObjectID = ""
    }
</script>

<PageTitle showGoBack title={routeID} link={{ text:"Create",href:`/admin/routes/${routeID}/objects/create` }}/>
{#if objects.length===0}
    <NoResult title={`No ${routeID}`} subTitle={`No ${routeID}, please add some`} link={{ text:"Create",href:`/admin/routes/${routeID}/objects/create` }}/>
{:else}
    <RouteObjects routeID={data.routeData.id} {objects} {deletingObjectID} on:delete={deleteObject}/>
{/if}