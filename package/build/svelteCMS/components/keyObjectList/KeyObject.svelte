<script lang="ts">
    export let editAble:boolean
    export let data:{key:string,value:string}
    import { createEventDispatcher } from "svelte";
    import KeyIcon from "svelteCMS/icons/KeyFile.svelte"
    import Confirm from "svelteCMS/components/shared/Confirm.svelte";
    const dispatch = createEventDispatcher()
    let showConfirm = false
</script>

<div class="keyObject">
    <span class="title">
        <KeyIcon />{data.key}
    </span>
    {#if editAble}
        <input class="value" type="text" bind:value={data.value} placeholder="value...">
    {:else}
        <span class="value">{data.value}</span>
    {/if}
    <button class="btn" on:click={()=>showConfirm=!showConfirm}>Remove</button>
    <Confirm bind:show={showConfirm} on:confirm={e=>{ if(e.detail) dispatch("remove",data)}}/>
</div>

<style lang="scss">
    .keyObject{
        flex: 1;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 5px 10px;
        background-color: var(--cardBg);
        border: 1.5px solid var(--borderColor);
        border-radius: 5px;
        box-shadow: 1px 2px 2px var(--shadow);
        position: relative;
    }
    .title{
        flex: 1;
        display: flex;
        align-items: center;
        gap: 3px;
        fill: var(--iconColor);
        font-size: 20px;
        font-weight: 400;
        text-transform: capitalize;
    }
    .value{
        min-width: 200px;
        width: 60%;
        color: var(--textColor);
        background-color: var(--appBg);
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        &:focus{ outline: none; }
    }
    .btn{
        cursor: pointer;
        border: none;
        background-color: var(--errorBg);
        color: var(--errorColor);
        padding: 3px 10px;
        border-radius: 3px;
        font-size: 13px;
        font-weight: 500;
    }
</style>