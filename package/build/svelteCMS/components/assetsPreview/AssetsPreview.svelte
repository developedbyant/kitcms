<script lang="ts">
    export let assets:AssetData[]
    import utils from "svelteCMS/lib/utils";
    import Asset from "./Asset.svelte";
    import type { AssetData } from "svelteCMS/types";

    /** Re order assets / move asset position */
    function handleAssetOrder(e:any){
        const moveData:{index:number,moving:"up"|"down"} = e.detail
        const firstArrayID = assets[0].id
        const lastArrayID = assets[assets.length-1].id
        const assetID = assets[moveData.index].id
        // move up
        if(moveData.moving==="up" && firstArrayID!==assetID){
            assets = utils.swapArrayIndex(assets,moveData.index,moveData.index-1)
        }
        // move down
        else if(moveData.moving==="down" && lastArrayID!==assetID){
            assets = utils.swapArrayIndex(assets,moveData.index,moveData.index+1)
        }
    }

    /** remove asset from current list */
    function removeAsset(e:any){
        const assetData:AssetData = e.detail
        const newAssets = assets.filter(data=>data.id!==assetData.id)
        assets = [...newAssets]
    }
</script>

<div class="assets">
    {#each assets as asset,index (asset.id)}
        <Asset {asset} {index} on:move={handleAssetOrder} on:remove={removeAsset}/>
    {/each}
</div>

<style>
    .assets{
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
</style>