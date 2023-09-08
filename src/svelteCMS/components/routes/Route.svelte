<script lang="ts">
    export let deletingRouteID:string
    export let route:RouteData
    export let showDel:boolean = true
    import { createEventDispatcher } from "svelte";
    import Confirm from "svelteCMS/components/shared/Confirm.svelte";
    // icons
    import PlusIcon from "svelteCMS/icons/Plus.svelte";
    import TrashIcon from "svelteCMS/icons/Trash.svelte";
    import PenIcon from "svelteCMS/icons/VectorPen.svelte"
    import XIcon from "svelteCMS/icons/X.svelte";
    import ViewIcon from "svelteCMS/icons/Eye.svelte"
    import CollectionsIcon from "svelteCMS/icons/Collections.svelte";
    import SpinIcon from "svelteCMS/icons/Spin.svelte";
    import type { RouteData } from "svelteCMS/types"
    $: deleting = deletingRouteID===route.id
    let showConfirm:boolean = false
    const dispatcher = createEventDispatcher()
    /** Handle delete route confirmation, dispatch delete event if user clicked confirm */
    const handleDelete = (e:any)=> { if(e.detail) { dispatcher("delete",route) ; showConfirm=false } }
</script>

<div class="route">
    <CollectionsIcon />
    <span class="name">{route.id}</span>
    <div class="buttons">
        <a href="/admin/routes/{route.id}" class="btn" data-label="View {route.id}'s objects">
            <ViewIcon size=15/>
        </a>
        <a href="/admin/routes/{route.id}/objects/create" class="btn" data-label="Add {route.id}'s objects">
            <PlusIcon size=15/>
        </a>
        <a href="/admin/routes/{route.id}/update" class="btn" data-label="Edit {route.id}">
            <PenIcon size=15/>
        </a>
        <!-- Only show delete button when wanted -->
        {#if showDel}
            <button class="btn delete" class:deleting disabled={deleting} data-label="Delete {route.id}" on:click={()=>showConfirm=!showConfirm}>
                <Confirm show={showConfirm} on:confirm={handleDelete}/>
                {#if deleting}
                    <SpinIcon size=15/>
                {:else if showConfirm}
                    <XIcon size=15/>
                {:else}
                    <TrashIcon size=15/>
                {/if}
            </button>
        {/if}
    </div>
</div>

<style lang="scss">
    .route{
        padding: 10px 10px 10px 15px;
        display: flex;
        align-items: center;
        fill: var(--iconColor);
        justify-content: space-between;
        gap: 20px;
        border-radius: 5px;
        background-color: var(--cardBg);
        box-shadow: 1px 2px 1px var(--shadow);
        border: 1.5px solid var(--borderColor);
    }
    .name{
        font-size: 20px;
        font-weight: 600;
        color: var(--cardColor);
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
        border-radius: 5px;
        background-color: var(--buttonBg);
        fill: var(--buttonColor);
        transition: all ease-in-out 0.2s;
        &:hover{
            cursor: pointer;
            transform: scale(0.95);
            box-shadow: 0 0 3px 2px var(--shadow);
        }
    }
    .btn.delete{
        background-color: var(--errorBg);
        color: var(--errorColor);
    }
    // when deleting route
    :global(.btn.delete.deleting svg){
        animation: spin 1s linear infinite;
    }
    @keyframes spin{
        from { transform: rotate(0deg) }
        to { transform: rotate(360deg) }
    }
</style>