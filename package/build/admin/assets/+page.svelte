<script lang="ts">
    export let data:PageData
    import { createToast } from "svelteCMS/components/toasts/store";
    import utils from "svelteCMS/lib/utils";
    import PageTitle from "svelteCMS/components/shared/PageTitle.svelte";
    import Assets from "svelteCMS/components/assets/assets.svelte";
    import FileSelector from "svelteCMS/components/shared/FileSelector.svelte";
    import AssetEditor from "svelteCMS/components/shared/AssetEditor.svelte";
    import NoResult from "svelteCMS/components/shared/NoResult.svelte";
    import Pagination from "svelteCMS/components/shared/Pagination.svelte";
    import type { PageData } from "./$types";
    import type { AssetData,ApiAssetDelete, ApiAssetUpdate } from "svelteCMS/types";
    $: assets = data.assets
    let assetToEdit:AssetData|false = false
    let showFileSelector = false
    let updating:boolean = false
    let deleting:boolean = false

    /** Handle when file selector upload new file */
    async function handleUpload(e:any) {
        const assetData:AssetData = e.detail
        // add asset to assets list
        assets = [assetData,...assets.splice(0,assets.length-1)]
    }

    /** Open asset editor asset when user click on it */
    async function handleAssetClick(e:any) {
        const assetData:AssetData = e.detail
        assetToEdit = assetData
    }

    /** Update asset when user click update from asset editor */
    async function updateAsset(e:any) {
        updating = true // set updating
        const assetData:AssetData = e.detail
        const apiLoad:ApiAssetUpdate['input'] = assetData
        const apiResponse:ApiAssetUpdate['output'] = await utils.apiRequest("/admin/api/assets/update",apiLoad)
        // show api response message
        createToast({ type:apiResponse.error?"error":"successful",msg:apiResponse.message })
        // wait 2 seconds
        await utils.wait(500)
        // if asset was updated, update from current assets list
        if(!apiResponse.error){
            const newAssets = assets.map(data=>{
                if(data._id===assetData._id) return assetData
                else return data
            })
            assets = [...newAssets]
        }
        assetToEdit = false // reset assetToEdit
        updating = false // reset updating
    }

    /** Delete asset when user confirm deletion from asset editor */
    async function deleteAsset(e:any) {
        deleting = true // set deleting
        const assetData:AssetData = e.detail
        const apiLoad:ApiAssetDelete['input'] = assetData
        const apiResponse:ApiAssetDelete['output'] = await utils.apiRequest("/admin/api/assets/delete",apiLoad)
        // show api response message
        createToast({ type:apiResponse.error?"error":"successful",msg:apiResponse.message })
        // wait 2 seconds
        await utils.wait(500)
        // if asset was deleted, remove from current assets list
        if(!apiResponse.error){
            const newAssets = assets.filter(data=>data._id!==assetData._id)
            assets = [...newAssets]
        }
        assetToEdit = false // reset assetToEdit
        deleting = false // reset deleting
    }
</script>

<AssetEditor {updating} {deleting} bind:asset={assetToEdit} on:delete={deleteAsset} on:update={updateAsset}/>
<FileSelector bind:open={showFileSelector} on:upload={handleUpload}/>
<PageTitle showGoBack title="Assets" btnText="Upload" on:click={()=>showFileSelector=!showFileSelector}/>
{#if assets.length===0}
    <NoResult title="No assets" subTitle="No assets were founded" link="Upload" on:click={()=>showFileSelector=!showFileSelector}/>
{:else}
    <Assets {assets} on:assetClick={handleAssetClick}/>
    <Pagination basePath="/admin/assets" morePages={assets.length>=data.svelteCMS.appData.assetsPerPage}/>
{/if}