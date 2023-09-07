<script lang="ts">
    export let routeID:string
    export let blocks:RouteBlockData[]
    export let modalIsOpen:boolean
    import utils from "mdbCMS/lib/utils";
    import { page } from "$app/stores";
    import { blockTypes } from "mdbCMS/lib/data"
    import { createToast } from "mdbCMS/components/toasts/store";
    import Modal from "mdbCMS/components/shared/Modal.svelte";
    import Button from "mdbCMS/components/shared/Button.svelte";
    import Label from "mdbCMS/components/shared/Label.svelte";
    import NoResult from "mdbCMS/components/shared/NoResult.svelte";
    import Input from "mdbCMS/components/input/Input.svelte";
    import ChipSelector from "mdbCMS/components/chipsSelector/ChipSelector.svelte";
    import RouteBlock from "./RouteBlock.svelte";
    // icons
    import PlusIcon from "mdbCMS/icons/Plus.svelte";
    import type { RouteBlockData } from "mdbCMS/types";
    import ToggleSwitch from "./ToggleSwitch.svelte";
    let keyName:string = ""
    let selectedType = blockTypes[0]
    // only when linking route
    $: isLinkedRoute = selectedType==="linkRoute"
    let routes = $page.data.mdbCMS.routes
    let routesStringList = routes.filter(data=>data.id!==routeID).map(data=>data.id)
    let selectedRoute = ""
    let selectedRouteKey = ""
    let oneToMany:boolean = true
    $: selectedRouteKeys = routes.find(data=>data.id===selectedRoute)?.blocks.map(data=>data.id)

    /** add new block */
    function addNewBlock(){
        const blockExists = blocks.find(data=>data.id===keyName)
        // if block key name exists or key name value is empty, stop function
        if(blockExists){
            createToast({ type:"error",msg:`Block with id(name) '${keyName}' already exists`})
            return
        }
        // check if linking to a route and make sure all keys needed are provided
        if(isLinkedRoute && (!selectedRoute || !selectedRouteKey || !keyName)){
            createToast({ type:"error",msg:`Make sure you select the route you want to link to and the key`})
            return
        }
        const newBlock:RouteBlockData = { id:keyName,type:selectedType}
        // if it's a linked route
        if(isLinkedRoute){
            newBlock["link"] = {
                fromRoute:routeID,
                fromKey:keyName.trim(),
                toRoute:selectedRoute,
                toKey:selectedRouteKey,
                oneToMany:oneToMany
            }
        }
        // @ts-ignore block
        blocks = [...blocks,newBlock]
        createToast({ type:"successful",msg:`Block with '${keyName}' was added`})
        keyName = ""
        selectedType = blockTypes[0]
    }

    /** Swap route block position */
    function handleBlockSwap(e:any){
        const {fromID,toID} = e.detail as {fromID:string,toID:string}
        const newBlocksOrder = utils.swapIndex(blocks,"id",fromID,toID)
        blocks = [...newBlocksOrder]
    }

    /** Remove block from blocks */
    function removeBlock(e:any){
        const id = e.detail.id
        const newBlocksOrder = blocks.filter(data=>data.id!==id)
        blocks = [...newBlocksOrder]
    }

    /** Run add new block function when user click enter from input */
    const onKeyUp = (e:KeyboardEvent)=>{ if(e.code==="Enter") addNewBlock() }
</script>

<Modal bind:open={modalIsOpen}>
    <div class="modalContent">
        <Label text="Adding block" margin="0 0 5px 0"/>
        <Input on:keyup={onKeyUp} bind:value={keyName} type="input" placeholder="Block name..."/>
        <ChipSelector bind:selected={selectedType} values={blockTypes}/>
        <!-- when linking route -->
        {#if isLinkedRoute}
            <Label text="Is a one to many relation ?" margin="10px 0 5px 0">
                <ToggleSwitch bind:checked={oneToMany}/>
            </Label>
            <Label text="Link block to route" margin="10px 0 5px 0"/>
            <ChipSelector bind:selected={selectedRoute} values={routesStringList}/>
            {#if selectedRouteKeys}
                <Label text="To what key from route {selectedRoute} ?" margin="0 0 5px 0"/>
                <ChipSelector bind:selected={selectedRouteKey} values={selectedRouteKeys?selectedRouteKeys:[]}/>
            {/if}
        {/if}
        <Button disabled={keyName.trim()===""} text="Add" icon={PlusIcon} on:click={addNewBlock}/>
    </div>
</Modal>

{#if blocks.length===0}
    <NoResult title="No blocks" subTitle="Please add some route blocks"/>
{:else}
    <div class="blocks">
        {#each blocks as block }
            <RouteBlock {block} on:delete={removeBlock} on:change={handleBlockSwap}/>
        {/each}
    </div>
{/if}

<style lang="scss">
    .modalContent{
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color: var(--appBg);
        padding: 10px;
        border: 1px solid var(--borderColor);
        box-shadow: 1px 2px 2px var(--shadow);
        border-radius: 10px;
    }
    .blocks{
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
</style>