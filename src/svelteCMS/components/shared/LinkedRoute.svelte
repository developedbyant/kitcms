<script lang="ts">
    export let blockData:RouteBlockData
    export let data:{[key:string]:any}
    import { createEventDispatcher } from "svelte";
    import Confirm from "svelteCMS/components/shared/Confirm.svelte";
    import Button from "svelteCMS/components/shared/Button.svelte";
    import LinkIcon from "svelteCMS/icons/Link.svelte"
    import type { RouteBlockData } from "svelteCMS/types";
    const dispatch = createEventDispatcher()
    const targetKey = blockData.link ? blockData.link.toKey : ""
    const value = data[targetKey]
    let showConfirm = false
</script>

<div class="linkedRoute">
    <div class="icon">
        <LinkIcon />
    </div>
    <span class="title">{value}</span>
    <Button rounded full={false} text="Remove" on:click={()=>showConfirm=!showConfirm} config={{ bg:"var(--errorBg)",color:"var(--errorColor)"}} />
    <Confirm bind:show={showConfirm} on:confirm={(e)=>{ if(e.detail) dispatch("remove",value) }}/>
</div>
<style lang="scss">
    .linkedRoute{
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
    .icon{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 3px;
        background-color: rgba(0,0,0,5%);
        fill: var(--iconColor);
        border: 1.5px solid var(--borderColor);
        border-radius: 5px;
        box-shadow: 1px 2px 2px var(--shadow);
    }
    .title{
        flex: 1;
        font-size: 20px;
        font-weight: 300;
    }
</style>