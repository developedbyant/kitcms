<script lang="ts">
    // export let checkInputErrors:boolean
    export let value:any
    export let blockData:RouteBlockData
    import Label from "svelteCMS/components/shared/Label.svelte";
    import Flex from "svelteCMS/components/layout/Flex.svelte";
    import InputDate from "svelteCMS/components/shared/InputDate.svelte";
    import ToggleSwitch from "svelteCMS/components/shared/ToggleSwitch.svelte";
    import FileSelector from "../shared/FileSelector.svelte";
    import AssetPreview from "../shared/AssetPreview.svelte";
    import type { AssetData, RouteBlockData } from "svelteCMS/types";
    let isFileModalOpen:boolean = false

    /** handle single file selected */
    function handleFileSelected(e:any){
        const assetData:AssetData = e.detail
        value = assetData
    }
</script>

{#if ["date","boolean","file"].includes(blockData.type)}
    {@const btnText = (blockData.type==="file" && value) ? "Update" : blockData.type==="file" ? "Select" : ""}
    <Flex>
        <!-- show label when type is not boolean -->
        {#if blockData.type!=="boolean"}
            <Label text={blockData.id} margin="0 0 0 0" btn={btnText} on:click={()=>isFileModalOpen=!isFileModalOpen}/>
        {/if}
        <!-- display block input -->
        {#if blockData.type==="date"}
            <InputDate bind:value />
        {:else if blockData.type==="file"}
            <FileSelector bind:open={isFileModalOpen} on:selected={handleFileSelected}/>
            {#if value}
                <AssetPreview asset={value}/>
            {/if}
        {:else if blockData.type==="boolean"}
            <Label text={blockData.id} margin="0 0 0 0">
                <ToggleSwitch bind:checked={value} />
            </Label>
        {/if}
    </Flex>
{/if}