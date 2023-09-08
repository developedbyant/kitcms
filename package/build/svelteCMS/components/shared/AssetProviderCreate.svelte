<script lang="ts">
    export let open:boolean = false
    export let loading:boolean = false
    import { assetProvidersTemplate } from "svelteCMS/lib/data";
    import utils from "svelteCMS/lib/utils";
    import { createToast } from "svelteCMS/components/toasts/store";
    import { createEventDispatcher } from "svelte";
    import Modal from "svelteCMS/components/shared/Modal.svelte";
    import InPageButtons from "svelteCMS/components/inPageButtons/InPageButtons.svelte";
    import Input from "svelteCMS/components/input/Input.svelte";
    import Button from "svelteCMS/components/shared/Button.svelte";
    import type { AssetProviders,AssetProvidersNames } from "svelteCMS/types";
    const dispatch = createEventDispatcher()
    let checkInputErrors:boolean = false
    $: assetProvider = "cloudinary" as AssetProvidersNames
    $: assetProviderData = assetProvidersTemplate[assetProvider] as AssetProviders
    $: inPageButtons =  Object.entries(assetProvidersTemplate).map(data=>data[0])
    
    /** handle when user click button, send custom requests */
    function handleClick(){
        checkInputErrors = true // set check for input errors
        loading = true // set loading to button
        // check for any input errors and only run if no errors were founded
        const validatorErrors = utils.validateInputs(assetProviderData)
        if(validatorErrors.length>0){
            createToast({ type:"error",msg:validatorErrors[0].message })
            loading = false ; return
        }
        // send event
        dispatch("add",assetProviderData)
    }

    /** Reset all stages when viewer is closed */
    const resetAll = ()=>{
        loading = false
        checkInputErrors = false
        assetProvider = "cloudinary"
        for(const [providerName,data] of Object.entries(assetProvidersTemplate)){
            for(const [key,value] of Object.entries(data)){
                // @ts-ignore reset all default asset provider values
                if(key!=="name") data[key] = ""
            }
        }
    }
</script>

<Modal bind:open on:closed={resetAll}>
    <div class="provider">
        <InPageButtons bind:value={assetProvider} items={inPageButtons} />
        <div class="info">
            {#each Object.entries(assetProviderData) as [key,value] (key+assetProvider)}
                {#if key!=="name"}
                    <!-- svelte-ignore -->
                    <Input bind:value={assetProviderData[key]} error={checkInputErrors && value.trim()===""} type="password" placeholder="{key}..." />
                {/if}
            {/each}
            <Button {loading} text="add" on:click={handleClick}/>
        </div>
    </div>
</Modal>

<style lang="scss">
    .provider{
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color: var(--appBg);
        color: var(--textColor);
        padding: 10px;
        border-radius: 10px;
        border: 1.5px solid var(--borderColor);
    }
    .info{
        padding: 10px;
        background-color: rgba(0,0,0,.1);
        border: 1.5px solid var(--borderColor);
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
</style>