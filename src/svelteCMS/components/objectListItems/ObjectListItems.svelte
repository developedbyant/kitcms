<script lang="ts">
    export let blockData:RouteBlockData
    export let value:{[key: string]:any}[]
    import ObjectListItem from "./ObjectListItem.svelte";
    import type { RouteBlockData } from "svelteCMS/types";
</script>

<div class="objectKeys">
    {#each value as data,index (index)}
        <ObjectListItem bind:data {blockData} on:remove/>
    {/each}
</div>

<style lang="scss">
    .objectKeys{
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
</style>