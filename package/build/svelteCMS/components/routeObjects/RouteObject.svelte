<script lang="ts">
    export let routeID:string
    export let deletingObjectID:string
    import { createEventDispatcher } from "svelte";
    export let object:{ [key:string]:any }
    import ObjectTable from "./ObjectTable.svelte";
    import Confirm from "../shared/Confirm.svelte";
    // icons
    import JsonIcon from "svelteCMS/icons/Json.svelte";
    import EditIcon from "svelteCMS/icons/VectorPen.svelte";
    import TrashIcon from "svelteCMS/icons/Trash.svelte";
    import XIcon from "svelteCMS/icons/X.svelte";
    import SpinIcon from "svelteCMS/icons/Spin.svelte";
    const dispatch = createEventDispatcher()
    let showConfirm = false
    $: deleting = deletingObjectID===object._id
</script>

<div class="object">
    <div class="top">
        <div class="btn icon">
            <JsonIcon size=15/>
        </div>
        <span class="id">{object._id}</span>
        <div class="buttons">
            <a href="/admin/routes/{routeID}/objects/update/{object._id}" class="btn" data-label="Edit object">
                <EditIcon size=15/>
            </a>
            <button class="btn delete" class:deleting disabled={deleting} data-label="Delete object" on:click={()=>showConfirm=!showConfirm}>
                <Confirm show={showConfirm} on:confirm={(e)=>{ if(e.detail) dispatch("delete",object) }}/>
                {#if deleting}
                    <SpinIcon size=15/>
                {:else if showConfirm}
                    <XIcon size=15/>
                {:else}
                    <TrashIcon size=15/>
                {/if}
            </button>
        </div>
    </div>
    <ObjectTable {object}/>
</div>

<style lang="scss">
    .object{
        width: calc(100% / 2 - 5px);
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        gap: 20px;
        padding:7px 10px;
        margin-bottom: 15px;
        background-color: var(--antiAppBg);
        box-shadow: 1px 2px 3px var(--shadow);
        border-radius: 15px;
    }
    .top{
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }
    .id{
        font-size: 16px;
        font-weight: 400;
        color: var(--textColor);
        flex: 1;
    }
    .buttons{
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
    }
    .btn{
        border: none;
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        border-radius: 50%;
        background-color: var(--buttonBg);
        fill: var(--buttonColor);
        transition: all ease-in-out 0.2s;
        &:hover{
            cursor: pointer;
            transform: scale(0.95);
            box-shadow: 0 0 3px 2px var(--shadow);
        }
    }
    .btn.icon{
        fill: var(--iconColor);
        background-color: rgba(0, 128, 0, 0.201);
        border-radius: 50%;
    }
    .btn.delete{
        background-color: var(--errorBg);
        color: var(--errorColor);
    }
    // when deleting route
    :global(.btn.deleting svg){
        animation: spin 1s linear infinite;
    }
    // Mobile
    @media(max-width:700px){
        .object{
            width: 100%;
        }
        .id{
            /* Fix overflow on mobile */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 120px;
        }
    }
</style>