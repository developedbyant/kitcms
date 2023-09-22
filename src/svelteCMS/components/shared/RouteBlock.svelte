<script lang="ts">
    export let block:RouteBlockData
    import { createEventDispatcher } from "svelte";
    import { blockTypeIcons } from "svelteCMS/lib/data";
    import SwapAble from "svelteCMS/components/shared/SwapAble.svelte";
    import Confirm from "./Confirm.svelte";
    // icons
    import DragIcon from "svelteCMS/icons/Drag.svelte";
    import TrashIcon from "svelteCMS/icons/Trash.svelte";
    import XIcon from "svelteCMS/icons/X.svelte";
    import EditIcon from "svelteCMS/icons/VectorPen.svelte"
    import type { RouteBlockData } from "svelteCMS/types";
    const dispatch = createEventDispatcher()
    let showConfirm = false
</script>

<SwapAble id={block.id} config={{ count:2,margin:"10px",grow:1}} on:change>
    <div class="block">
        <div class="drag"><DragIcon /></div>
        <button class="btn edit" data-label="Edit {block.id}" on:click={()=>dispatch("edit",block)}>
            <EditIcon />
        </button>
        <button class="remove" data-label="Remove {block.id}" on:click={()=>showConfirm=!showConfirm}>
            <Confirm show={showConfirm} position="tl" on:confirm={(e)=>{ if(e.detail) dispatch("delete",block)}}/>
            {#if showConfirm} <XIcon /> {:else} <TrashIcon /> {/if}
        </button>
        <span class="keyName">{block.id}</span>
        <div class="type" data-label="Type : {block.type}">{blockTypeIcons[block.type]}</div>
    </div>
</SwapAble>

<style lang="scss">
    .block{
        cursor: grabbing;
        width: calc(100% / 3 - 10px);
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        padding: 5px 10px;
        background-color: var(--antiAppBg);
        border-radius: 5px;
        box-shadow: 1px 2px 2px var(--shadow);
    }
    .drag,.remove,.btn{
        cursor: grab;
        width: 30px; height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        background-color: var(--appBg);
        box-shadow: 1px 2px 3px var(--shadow);
        fill: var(--iconColor);
    }
    .btn.edit{
        cursor: pointer;
        border: none;
        border-radius: 50%;
        background-color: var(--buttonBg);
        color: var(--buttonColor);
    }
    .remove{
        cursor: pointer;
        border: none;
        background-color: var(--errorBg);
        fill: var(--errorColor);
        border-radius: 50%;
    }
    .keyName{
        flex: 1;
        font-size: 20px;
        font-weight: 500;
        color: var(--textColor);
        text-align: center;
    }
    .type{
        width: 30px; height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        padding: 5px;
        border-radius: 5px;
        border: 1px solid var(--textColor);
        background-color: var(--appBg);
    }
</style>