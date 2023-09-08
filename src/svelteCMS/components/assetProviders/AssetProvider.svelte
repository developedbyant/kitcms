<script lang="ts">
    export let provider:AssetProvidersNames
    export let deleting:AssetProvidersNames|false
    export let setting:AssetProvidersNames|""
    import { createEventDispatcher } from "svelte";
    import { page } from "$app/stores";
    import Button from "../shared/Button.svelte";
    import Confirm from "../shared/Confirm.svelte";
    import CheckMarkIcon from "svelteCMS/icons/Check.svelte"
    // images
    import cloudinaryImage from "svelteCMS/images/providers/cloudinary.png"
    import testImage from "svelteCMS/images/providers/test.png"
    import type { AssetProvidersNames } from "svelteCMS/types";
    /** Show confirm when user click remove asset provider btn */
    let showConfirm = false
    const dispatch = createEventDispatcher()
    $: active = $page.data.svelteCMS.appData.assetProvider===provider
    $: imageSrc = provider==="cloudinary" ? cloudinaryImage : testImage
</script>

<div class="provider">
    <div class="image">
        <img src={imageSrc} alt={provider}>
        <span class="name">{provider}</span>
    </div>
    <div class="info">
        <div class="buttons">
            <Button text={active?"Using":"Use"} on:click={()=>dispatch("setProvider",provider)} loading={setting===provider} icon={active?CheckMarkIcon:undefined} disabled={active} config={ !active ? undefined : { bg:"var(--appBg)",color:"var(--buttonColor)"}}/>
            <Button text="Remove" loading={deleting==provider} config={{ bg:"var(--errorBg)",color:"var(--errorColor)"}} on:click={()=>showConfirm=!showConfirm}/>
            <Confirm bind:show={showConfirm} on:confirm={(e)=>{ if(e.detail) dispatch("delete",provider) }}/>
        </div>
    </div>
</div>

<style lang="scss"> 
    .provider{
        width: calc(100% / 5 - 10px);
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        gap: 10px;
        background-color: var(--cardBg);
        color: var(--cardColor);
        border: 1.5px solid var(--borderColor);
        box-shadow: 1px 2px 2px var(--shadow);
        border-radius: 10px;
        overflow: hidden;
    }
    .image{
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--borderColor);
        position: relative;
        img{
            object-fit: cover;
            object-position: center;
            width: 100%;
            height: 100%;
        }
    }
    .info{
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 5px;
        justify-content: space-between;
        padding: 10px;
    }
    .name{
        font-size: 15px;
        font-weight: 600;
        text-transform: capitalize;
        position: absolute;
        top: 5px; right: 5px;
        padding: 5px 10px;
        background-color: var(--blurBg);
        color: var(--headerColor);
        border: 1.5px solid var(--borderColor);
        border-radius: 50px;
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
    }
    .buttons{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        position: relative;
    }
    // mobile
    @media(max-width:1000px){
        .provider{
            width: calc(100% / 4 - 10px);
        }
    }
    @media(max-width:700px){
        .provider{
            width: 100%;
        }
    }
</style>
