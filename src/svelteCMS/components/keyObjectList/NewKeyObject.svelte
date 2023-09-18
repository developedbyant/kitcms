<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher()
    let data:{key:string,value:string} = { key:"",value:""}
</script>

<div class="keyObject">
    <div class="flex">
        <span class="title">Key</span>
        <input class="value" type="text" bind:value={data.key} placeholder="value...">
    </div>
    <div class="flex">
        <span class="title">Value</span>
        <input class="value" type="text" bind:value={data.value} placeholder="value...">
    </div>
    <button class="btn" on:click={()=>dispatch("add",data)}>Add</button>
</div>

<style lang="scss">
    .keyObject{
        display: flex;
        gap: 10px;
        padding: 5px 10px;
        background-color: var(--cardBg);
        border: 1.5px solid var(--borderColor);
        border-radius: 5px;
        box-shadow: 1px 2px 2px var(--shadow);
        position: relative;
        margin: 10px 0;
    }
    .flex{
        flex: 1;
        display: flex;
        align-items: center;
        gap: 5px;
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
        width: 100%;
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
        background-color: var(--buttonBg);
        color: var(--buttonColor);
        padding: 3px 10px;
        border-radius: 3px;
        font-size: 13px;
        font-weight: 500;
    }
    // on mobile
    @media(max-width:700px){
        .keyObject{
            flex-direction: column;
        }
        .value{
            max-width: 300px;
        }
    }
</style>