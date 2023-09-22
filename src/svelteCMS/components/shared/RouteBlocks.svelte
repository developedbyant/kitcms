<script lang="ts">
    export let routeID:string
    export let blocks:RouteBlockData[]
    export let modalIsOpen:boolean
    import utils from "svelteCMS/lib/utils";
    import { page } from "$app/stores";
    import { blockTypes } from "svelteCMS/lib/data"
    import { createToast } from "svelteCMS/components/toasts/store";
    import Modal from "svelteCMS/components/shared/Modal.svelte";
    import Button from "svelteCMS/components/shared/Button.svelte";
    import Label from "svelteCMS/components/shared/Label.svelte";
    import NoResult from "svelteCMS/components/shared/NoResult.svelte";
    import Input from "svelteCMS/components/input/Input.svelte";
    import ChipSelector from "svelteCMS/components/chipsSelector/ChipSelector.svelte";
    import RouteBlock from "./RouteBlock.svelte";
    import KeyObjectList from "../keyObjectList/KeyObjectList.svelte";
    // icons
    import PlusIcon from "svelteCMS/icons/Plus.svelte";
    import CloudIcon from "svelteCMS/icons/Cloud.svelte";
    import ToggleSwitch from "./ToggleSwitch.svelte";
    import type { RouteBlockData } from "svelteCMS/types";
    let editing:boolean = false
    let keyName:string = ""
    let selectedType = blockTypes[0]
    let routes = $page.data.svelteCMS.routes
    let routesStringList = routes.filter(data=>data.id!==routeID).map(data=>data.id)
    // only when linking route
    let isLinkedRoute = { selectedRoute:"",selectedRouteKey:"",oneToMany:true }
    let isObjectList = { key:"",type:"string",keys:{} } as { key:string,type:"boolean"|"string"|"number",keys:{ [key:string]:"boolean"|"string"|"number"}}
    $: selectedRouteKeys = routes.find(data=>data.id===isLinkedRoute.selectedRoute)?.blocks.map(data=>data.id)
    $: disabled = (selectedType==="objectList" && Object.keys(isObjectList.keys).length===0) || (selectedType==="linkRoute" && (!isLinkedRoute.selectedRoute || !isLinkedRoute.selectedRouteKey)) || keyName.trim()===""
    /** add new block */
    function addOrUpdate(){
        // make sure block name does not exist
        if(blocks.find(data=>data.id===keyName) && !editing){ createToast({ type:"error",msg:`Block with id(name) '${keyName}' already exists`}); return }
        // add new block
        const newBlock:RouteBlockData = { id:keyName,type:selectedType}
        // check if linking to a route and make sure all keys needed are provided
        if(selectedType==="linkRoute"){
            if(!isLinkedRoute.selectedRoute || !isLinkedRoute.selectedRouteKey || !keyName){ createToast({ type:"error",msg:`Make sure you select the route you want to link to and the key`}) ; return }
            // add extra data to block
            newBlock["link"] = {
                fromRoute:routeID,
                fromKey:keyName.trim(),
                toRoute:isLinkedRoute.selectedRoute,
                toKey:isLinkedRoute.selectedRouteKey,
                oneToMany:isLinkedRoute.oneToMany
            }
        }
        // check if it's a object list and make there is at least one key in object
        if(selectedType==="objectList"){
            if(Object.keys(isObjectList.keys).length===0){ createToast({ type:"error",msg:`Object list require at least one key`}) ; return }
            // add extra data to block
            newBlock["objectKeys"] = isObjectList.keys
            // reset all
            isObjectList.keys = {}
        }
        // update
        if(editing){
            const newBlocksData = blocks.map(data=>data.id===newBlock.id ? newBlock : data)
            blocks = [...newBlocksData]
        }
        // add new block
        else blocks = [...blocks,newBlock]
        // reset states
        resetAll()
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

    /** try to add to ObjectList */
    function addKeyObject(){
        if(isObjectList.key in isObjectList.keys){ createToast({ type:"error",msg:`Key '${isObjectList.key}' already exists`}) ; return }
        // add object key and clear value
        isObjectList.keys[isObjectList.key] = isObjectList.type
        isObjectList.key = ""
    }

    /** remove key from object keys */
    function rmKeyObject(e:any){
        const keyData = e.detail as { key:string,value:any }
        delete isObjectList.keys[keyData.key]
        isObjectList.keys = {...isObjectList.keys}
    }

    /** edit block */
    function editBlock(e:any){
        const blockData = e.detail as RouteBlockData
        modalIsOpen = true
        editing = true
        selectedType = blockData.type
        keyName = blockData.id
        if(blockData.link){
            isLinkedRoute = {
                oneToMany:blockData.link.oneToMany,
                selectedRoute:blockData.link.toRoute,
                selectedRouteKey:blockData.link.toKey
            }
        }
        // @ts-ignore
        if(blockData.objectKeys) isObjectList.keys = blockData.objectKeys
    }

    /** Run add new block function when user click enter from input */
    const onKeyUp = (e:KeyboardEvent)=>{ if(e.code==="Enter") addOrUpdate() }

    /** reset all states when close */
    const resetAll = ()=>{
        editing = false
        selectedType="input"
        keyName=""
        isObjectList.keys = {}
    }
</script>

<Modal bind:open={modalIsOpen} on:closed={resetAll}>
    <div class="modalContent">
        <Label text="Adding block" margin="0 0 5px 0"/>
        <Input on:keyup={onKeyUp} bind:value={keyName} type="input" placeholder="Block name..."/>
        <ChipSelector bind:selected={selectedType} values={blockTypes}/>
        {#if selectedType==="objectList"}
            <Label text="Describe object keys" margin="10px 0 5px 0"/>
            <div class="flex">
                <Input bind:value={isObjectList.key} type="input" placeholder="key name..."/>
                <ChipSelector bind:selected={isObjectList.type} values={["string","number","boolean"]} />
                <Button disabled={isObjectList.key.trim()===""} text="Add key" rounded on:click={addKeyObject}/>
            </div>
            {#if Object.keys(isObjectList.keys).length>0}
                <KeyObjectList editAble={false} allowRm={false} on:remove={rmKeyObject} value={Object.entries(isObjectList.keys).map(data=>{ return{ key:data[0],value:data[1]} })}/>
            {/if}
        {/if}
        <!-- when linking route -->
        {#if selectedType==="linkRoute"}
            <Label text="Is a one to many relation ?" margin="10px 0 5px 0">
                <ToggleSwitch bind:checked={isLinkedRoute.oneToMany}/>
            </Label>
            <Label text="Link block to route" margin="10px 0 5px 0"/>
            <ChipSelector bind:selected={isLinkedRoute.selectedRoute} values={routesStringList}/>
            {#if selectedRouteKeys}
                <Label text="To what key from route {isLinkedRoute.selectedRoute} ?" margin="0 0 5px 0"/>
                <ChipSelector bind:selected={isLinkedRoute.selectedRouteKey} values={selectedRouteKeys?selectedRouteKeys:[]}/>
            {/if}
        {/if}
        <Button {disabled} text={editing?"Update":"Add"} icon={editing?CloudIcon:PlusIcon} on:click={addOrUpdate}/>
    </div>
</Modal>

{#if blocks.length===0}
    <NoResult title="No blocks" subTitle="Please add some route blocks"/>
{:else}
    <div class="blocks">
        {#each blocks as block }
            <RouteBlock {block} on:delete={removeBlock} on:change={handleBlockSwap} on:edit={editBlock}/>
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
    .flex{
        display: flex;
        flex-direction: column;
        gap: 10px;
        border-radius: 5px;
        background-color: var(--blurBg);
        padding: 10px;
        border: 1px solid var(--borderColor);
    }
</style>