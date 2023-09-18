<script lang="ts">
    export let blockData:RouteBlockData
    export let data:{[key: string]:any}
    import Input from "../input/Input.svelte";
    import ToggleSwitch from "../shared/ToggleSwitch.svelte";
    import Button from "../shared/Button.svelte";
    import Confirm from "../shared/Confirm.svelte";
    import KeyIcon from "svelteCMS/icons/KeyFile.svelte"
    import type { RouteBlockData } from "svelteCMS/types";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher()
    let showConfirm = false
    let keys = Object.entries(data)
    let objectKeys = blockData.objectKeys as any
</script>

<div class="items">
    {#each keys as [key,type2]}
    {@const type = objectKeys[key]}
        <div class="item">
            <span class="title"><KeyIcon size=17 />{key}</span>
            {#if type==="boolean"}
                <ToggleSwitch bind:checked={data[key]}/>
            {:else}
                <Input {type} bind:value={data[key]}/>
            {/if}
        </div>
    {/each}
    <div style="position: relative;">
        <Button text="Remove" config={{ bg:"var(--errorBg)",color:"var(--errorColor)"}} on:click={()=>showConfirm=!showConfirm}/>
        <Confirm bind:show={showConfirm} on:confirm={e=>{ if(e.detail) dispatch("remove",data)}}/>
    </div>
</div>

<style lang="scss">
    .items{
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        gap: 5px;
        background-color: var(--cardBg);
        border: 1px solid var(--borderColor);
        padding: 5px;
        border-radius: 3px;
    }
    .item{
        flex: 1;
        display: flex;
        align-items: center;
        gap: 10px;
        background-color: var(--appBg);
        padding: 5px 10px;
        border-radius: 5px;
    }
    .title{
        flex: 1;
        display: flex;
        align-items: center;
        gap: 3px;
        fill: var(--iconColor);
        font-size: 15px;
        font-weight: 400;
        text-transform: capitalize;
    }
</style>