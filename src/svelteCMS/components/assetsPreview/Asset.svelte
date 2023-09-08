<script lang="ts">
    export let index:number
    export let asset:AssetData
    import { createEventDispatcher } from "svelte";
    import Confirm from "svelteCMS/components/shared/Confirm.svelte";
    // icons
    import ArrowDownIcon from "svelteCMS/icons/ArrowDown.svelte";
    import ArrowUpIcon from "svelteCMS/icons/ArrowUp.svelte";
    import type { AssetData } from "svelteCMS/types";
    let showConfirm = false
    const dispatch = createEventDispatcher()
    const toggleConfirm = ()=> showConfirm = !showConfirm
</script>

<div class="asset">
    <img src={asset.src} alt={asset.title}>
    <div class="buttons">
        <Confirm bind:show={showConfirm} position="tl" on:confirm={e=>{if(e.detail) dispatch("remove",asset) }}/>
        <button class="btn remove" on:click={toggleConfirm}>Remove</button>
        <div class="mover">
            <button class="btn" data-label-tl data-label="Move up" on:click={()=>dispatch("move",{ index,moving:"up"})}>
                <ArrowUpIcon size=15 />
            </button>
            <button class="btn" data-label-tl data-label="Move down" on:click={()=>dispatch("move",{ index,moving:"down"})}>
                <ArrowDownIcon size=15 />
            </button>
        </div>
    </div>
</div>

<style>
    .asset{
        width: calc(100% / 4 - 10px);
        background-color: rebeccapurple;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 170px;
        overflow: hidden;
        border-radius: 5px;
        border: 1px solid var(--borderColor);
        background-color: var(--antiAppBg);
        position: relative;
    }
    .asset img{
        object-fit: cover;
        object-position: center;
        max-height: 100%;
        width: auto;
        height: 100%;
    }
    .buttons{
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        bottom: 0; left: 0;
        width: 100%;
        padding: 5px;
        background-color: var(--blurBg);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        /* border-radius: 5px 5px 0 0; */
        position: absolute;
    }
    .btn{
        background-color: var(--buttonBg);
        color: var(--buttonColor);
        fill: var(--buttonColor);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px 8px;
        border-radius: 2px;
        border: none;
        font-size: 12px;
        font-weight: 500;
    }
    .btn.remove{
        background-color: var(--errorBg);
        color: var(--errorColor);
        border-radius: 20px;
    }
    .mover{
        display: flex;
        align-items: center;
        gap: 5px;
    }
    @media(max-width:1200px){
        .asset{
            width: calc(100% / 2 - 10px);
        }
    }
    @media(max-width:700px){
        .asset{
            width: 100%;
        }
    }
</style>