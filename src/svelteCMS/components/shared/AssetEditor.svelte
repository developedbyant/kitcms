<script lang="ts">
    export let asset:AssetData|false = false
    export let updating:boolean = false
    export let deleting:boolean = false
    import { createEventDispatcher } from "svelte";
    import Modal from "svelteCMS/components/shared/Modal.svelte";
    import Label from "svelteCMS/components/shared/Label.svelte";
    import Button from "svelteCMS/components/shared/Button.svelte";
    import Input from "svelteCMS/components/shared/Input.svelte";
    import AssetPreview from "svelteCMS/components/shared/AssetPreview.svelte";
    import Confirm from "svelteCMS/components/shared/Confirm.svelte";
    // icons
    import CloudIcon from "svelteCMS/icons/Cloud.svelte";
    import TrashIcon from "svelteCMS/icons/Trash.svelte";
    import type { AssetData } from "svelteCMS/types";
    let showConfirm:boolean = false
    const dispatch = createEventDispatcher()
</script>

<Modal open={asset!==false} on:closed={()=>showConfirm=false}>
    {#if asset}
        <div class="wrap">
            <Label text="Asset editor"/>  
            <Input placeholder="Asset name..." bind:value={asset.title}/>
            <AssetPreview {asset}/>
            <div class="buttons">
                <Button text="Update" icon={CloudIcon} loading={updating} on:click={(e)=>{ if(e.detail) dispatch("update",asset)}}/>
                <Button text="Delete" icon={TrashIcon} loading={deleting} on:click={()=>showConfirm=!showConfirm} config={{ bg:"var(--errorBg)",color:"var(--errorColor)"}} />
                <Confirm bind:show={showConfirm} on:confirm={(e)=>{ if(e.detail) dispatch("delete",asset)}}/>
            </div>
        </div>
    {/if}
</Modal>

<style lang="scss">
    .wrap{
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color: var(--appBg);
        color: var(--textColor);
        padding: 10px;
        border-radius: 10px;
        border: 1.5px solid var(--borderColor);
    }
    .buttons{
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        position: relative;
    }
</style>