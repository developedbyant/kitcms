<script lang="ts">
    export let checkInputErrors:boolean
    export let value:any
    export let blockData:RouteBlockData
    import { createEventDispatcher } from "svelte";
    import utils from "svelteCMS/lib/utils";
    import Label from "svelteCMS/components/shared/Label.svelte";
    import Flex from "svelteCMS/components/layout/Flex.svelte";
    import Input from "svelteCMS/components/shared/Input.svelte";
    import InputNumber from "svelteCMS/components/shared/InputNumber.svelte";
    import TextArea from "svelteCMS/components/shared/TextArea.svelte";
    import Editor from "svelteCMS/components/editor/Editor.svelte";
    import FileSelector from "svelteCMS/components/shared/FileSelector.svelte";
    import SelectRouteObjects from "../shared/SelectRouteObjects.svelte";
    import type { AssetData, RouteBlockData } from "svelteCMS/types";
    import AssetsPreview from "../assetsPreview/AssetsPreview.svelte";
    import InputChips from "../inputChips/InputChips.svelte";
    // if value is undefined is because it's a new block so add default value
    if(value===undefined) value = utils.getBlockDefaultValue(blockData)

    const dispatch = createEventDispatcher()
    /** If asset selector is open or not */
    let isFileSelectorOpen:boolean = false

    /** handle asset selected and add to list of asset (value) if not exits*/
    function handleFileSelected(e:any){
        const assetData:AssetData = e.detail
        const fileExistsInValue = value.find((data:AssetData)=>data.id===assetData.id)
        // if value does not exist in value, add asset to value
        if(!fileExistsInValue){
            value = [...value,assetData]
        }
    }
    
    /** show inputs error */
    $: error = checkInputErrors && (
        (["input","slug","text"].includes(blockData.type) && value.trim()==="") || (blockData.type==="number" && value==="") || !value
    )
</script>
{#if ["input","stringList","text","number","linkRoute","editor","slug","files"].includes(blockData.type)}
    {@const btnText = blockData.type==="slug"?"Generate" : blockData.type==="files" ? "Select" : ""}
    <Flex>
        <!-- display block label -->
        {#if blockData.type==="linkRoute"}
            <Label text={blockData.id} margin="0 0 0 0" rounded btn={{ href:`/admin/routes/${blockData.link?.toRoute}/objects/create`,text:`Create ${blockData.link?.toRoute}`,newTab:true}}/>
        {:else if blockData.type==="files"}
            <Label text={blockData.id} margin="0 0 0 0" rounded btn={btnText} on:click={()=>isFileSelectorOpen=true}/>
        {:else}
            <Label text={blockData.id} margin="0 0 0 0" rounded btn={btnText} on:click={()=>dispatch("genSlug",blockData)}/>
        {/if}
        <!-- display block input -->
        {#if blockData.type==="input"}
            <Input bind:value placeholder={blockData.id} {error}/>
        {:else if blockData.type==="files"}
            <FileSelector bind:open={isFileSelectorOpen} on:selected={handleFileSelected}/>
            <!-- show files/assets -->
            {#if value.length > 0}
                <AssetsPreview bind:assets={value}/>
            {/if}
        {:else if blockData.type==="text"}
            <TextArea bind:value placeholder={blockData.id} {error}/>
        {:else if blockData.type==="stringList"}
            <InputChips bind:values={value} />
        {:else if blockData.type==="slug"}
            <Input bind:value placeholder={blockData.id} {error}/>
        {:else if blockData.type==="number"}
            <InputNumber bind:value placeholder={blockData.id} {error}/>
        {:else if blockData.type==="editor"}
            <Editor bind:value />
        {:else if blockData.type==="linkRoute" && blockData.link?.oneToMany}
            <SelectRouteObjects oneToMany={true} bind:value {blockData}/>
        {:else if blockData.type==="linkRoute" && !blockData.link?.oneToMany}
            <SelectRouteObjects oneToMany={false} bind:value {blockData}/>
        {/if}
    </Flex>
{/if}