<script lang="ts">
    export let height:string = "200px"
    export let asset:AssetData
    import type { AssetData } from "svelteCMS/types";
</script>

<div class="assetPreview" style="height: {height};">
    <img src={asset.src} alt={asset.title}>
</div>

<style>
    .assetPreview{
        display: flex;
        align-items: center;
        justify-content: center;
        /* height: 200px; */
        overflow: hidden;
        border-radius: 5px;
        border: 1px solid var(--borderColor);
        background-color: var(--antiAppBg);
    }
    .assetPreview img{
        object-fit: cover;
        object-position: center;
        max-height: 100%;
        /* width: auto; */
        width: 100%;
        height: 100%;
    }
</style>