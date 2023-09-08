<script lang="ts">
    export let data:PageData
    import utils from "svelteCMS/lib/utils";
    import { createToast } from "svelteCMS/components/toasts/store";
    import PageTitle from "svelteCMS/components/shared/PageTitle.svelte";
    import NoResult from "svelteCMS/components/shared/NoResult.svelte";
    import AssetProviderCreate from "svelteCMS/components/shared/AssetProviderCreate.svelte";
    import Label from "svelteCMS/components/shared/Label.svelte";
    import AssetProviders from "svelteCMS/components/assetProviders/AssetProviders.svelte";
    import ConfigForm from "./ConfigForm.svelte";
    import type { PageData } from "./$types";
    import type { ApiAssetProviderDelete, ApiSetAssetProvider, AssetProvidersNames,SettingsData,AssetProviders as AssetProvidersData,ApiAssetProviderSet, ApiSettingUpdate } from "svelteCMS/types";
    let assetProviders = data.assetProviders
    let userData = data.svelteCMS.userData
    let deletingProvider:AssetProvidersNames|false = false
    let settingProvider:AssetProvidersNames|"" = ""
    // on adding provider
    let isAddingNewAssetProvider:boolean = assetProviders.length===0
    let addingProvider:boolean = false
    // save app settings
    let updatingApp:boolean = false

    /** Open or close set asset provider */
    const openNewAssetProvider = ()=> isAddingNewAssetProvider = true

    /** Add new asset provider */
    async function addProvider(e:any) {
        const provider:AssetProvidersData = e.detail
        const apiLoad:ApiSetAssetProvider['input'] = provider
        const apiResponse:ApiSetAssetProvider['output'] = await utils.apiRequest("/admin/api/providers/create",apiLoad)
        // wait 1 second to show message
        await utils.wait(500)
        // show api response
        createToast({ type:apiResponse.error?"error":"successful",msg:apiResponse.message })
        // if provider was added, add it to current providers list
        if(!apiResponse.error){
            const newProvidersList = [...assetProviders,apiResponse.data.name]
            assetProviders = [...newProvidersList]
        }
        // close adding new provider box
        addingProvider = false
        isAddingNewAssetProvider = false
    }

    /** Delete asset provider */
    async function deleteProvider(e:any) {
        const provider:AssetProvidersNames = e.detail
        deletingProvider = provider // set provider's name being deleted
        const apiLoad:ApiAssetProviderDelete['input'] = { name:provider }
        const apiResponse:ApiAssetProviderDelete['output'] = await utils.apiRequest("/admin/api/providers/delete",apiLoad)
        // wait 1 second to show message
        await utils.wait(500)
        // show api response
        createToast({ type:apiResponse.error?"error":"successful",msg:apiResponse.message })
        // if provider was deleted, remove it from current providers list
        if(!apiResponse.error){
            assetProviders = [...assetProviders.filter(data=>data!==provider)]
        }
        deletingProvider = false // remove provider's name being deleted
    }

    /** Start using provider */
    async function setProvider(e:any){
        const provider:AssetProvidersNames = e.detail
        settingProvider = provider // set provider's name being setting
        // send request
        const apiLoad:ApiAssetProviderSet['input'] = { name:provider }
        const apiResponse:ApiAssetProviderSet['output'] = await utils.apiRequest("/admin/api/providers/set",apiLoad)
        // wait 1 second to show message
        await utils.wait(500)
        // show api response
        createToast({ type:apiResponse.error?"error":"successful",msg:apiResponse.message })
        // if provider was set reload page
        if(!apiResponse.error) location.reload()
        settingProvider = "" // remove provider's name being setting
    }

    /** Save app settings */
    async function saveDisplayConfig(e:any) {
        updatingApp = true // set updatingApp to true
        const displayConfig:SettingsData = e.detail
        const validatorErrors = utils.validateInputs(displayConfig)
        if(validatorErrors.length>0) createToast({ type:"error",msg:validatorErrors[0].message })
        // update settings
        const apiLoad:ApiSettingUpdate['input'] = displayConfig
        const apiResponse:ApiSettingUpdate['output'] = await utils.apiRequest("/admin/api/app/update-settings",apiLoad)
        // show response msg
        await utils.wait(500)
        createToast({ type:apiResponse.error?"error":"successful",msg:apiResponse.message })    
        updatingApp = false // set updatingApp to false
    }
</script>

<AssetProviderCreate bind:loading={addingProvider} bind:open={isAddingNewAssetProvider} on:add={addProvider}/>
<PageTitle showGoBack title="Hi {userData.firstName}" link={{ href:"/admin/auth/logout",text:"Logout",disableLoad:"yes"}}/>
<ConfigForm bind:updatingApp on:saveDisplayConfig={saveDisplayConfig}/>
<Label text="Asset providers" btn="Add new" on:click={openNewAssetProvider} margin="0"/>
{#if assetProviders.length===0}
    <NoResult title="No asset providers" subTitle="No asset providers were founded" link="Add one" on:click={openNewAssetProvider}/>
{:else}
    <AssetProviders on:delete={deleteProvider} on:setProvider={setProvider} {assetProviders} deleting={deletingProvider} setting={settingProvider} />
{/if}