<script lang="ts">
    export let assetProviders:AssetProvidersNames[]
    export let deleting:AssetProvidersNames|false
    export let setting:AssetProvidersNames|""
    import AssetProvider from "./AssetProvider.svelte";
    import type { AssetProvidersNames } from "svelteCMS/types";
</script>

<div class="providers">
    {#each assetProviders as provider}
        <AssetProvider on:update on:delete on:setProvider {deleting} {provider} {setting}/>
    {/each}
</div>

<style lang="scss"> 
    .providers{
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
</style>