<script lang="ts">
    export let oneToMany:boolean
    export let blockData:RouteBlockData
    export let value:{[key:string]:any}|{[key:string]:any}[]
    export let error:boolean = false
    export let placeholder:string = `Search object to link from '${blockData.link?.toRoute}'`
    import utils from "svelteCMS/lib/utils";
    import Chips from "svelteCMS/components/shared/Chips.svelte";
    import LinkedRoute from "svelteCMS/components/shared/LinkedRoute.svelte";
    import type { ApiObjectSearch, ObjectData, RouteBlockData } from "svelteCMS/types";
    import { createToast } from "../toasts/store";
    let inputValue:string = ""
    let focus:boolean = false
    let input:HTMLInputElement
    let targetKey = blockData.link!.toKey
    let routeID = blockData.link!.toRoute
    /** list of objects return from search objects */
    let searchResult:{[key:string]:any}[] = []
    /** css animation */
    $: heightClass = ( value instanceof Array && value.length>0 ) || value || searchResult.length > 0

    /** search route objects when input value changes */
    async function search(){
        // if input value is empty, stop function and reset result result list
        if(inputValue.trim().length===0){
            searchResult = [] ; return
        }
        // search objects
        const apiLoad:ApiObjectSearch['input'] = {
            routeID,limit: 5,
            query: { text: inputValue,targetKey }
        }
        const apiResponse:ApiObjectSearch['output'] = await utils.apiRequest("/admin/api/objects/search",apiLoad)
        // show error, if any error was returned
        if(apiResponse.error) createToast({ type:"error",msg:apiResponse.message })
        else{
            searchResult = [...apiResponse.data]
            // send search request and did not get any result add error
            if(inputValue.trim().length > 0 && apiResponse.data.length===0) error = true
            else error = false
        }
    }

    /** Handle result item clicked/selected */
    function handleSelect(e:any){
        const selectedValue = e.detail as string
        const objectData = searchResult.find(data=>data[targetKey]===selectedValue) as ObjectData
        // if linked route is a one to many relation, add object to list if object does not exists in value
        if(oneToMany){
            const valueExists = value.find((data:any)=>data[targetKey]===selectedValue)
            // @ts-ignore
            if(!valueExists) value = [...value,objectData]
        }
        // if it's a one to one relationship, set object data to value
        else value = objectData
        // reset search result when ever result item is selected/clicked
        searchResult = []
        // reset input value
        inputValue = ""
    }

    /** remove linked object */
    function removeLinkedObject(e:any){
        const selectedValue = e.detail as string
        // if linked route is a one to many relation, remove item from value list
        if(oneToMany){
            const newValue = value.filter((data:any)=>data[targetKey]!==selectedValue)
            value = [...newValue]
        }
        // if it's a one to one relationship, set value to null
        else{ // @ts-ignore
            value = null
        }
    }
</script>

<div class="container" class:error class:focus class:heightClass>
    <input bind:this={input} bind:value={inputValue} {placeholder} on:keyup={search} on:focusin={()=>focus=true} on:focusout={()=>focus=false}>
    <!-- show result list -->
    {#if searchResult.length>0}
        <Chips values={searchResult.map(data=>data[targetKey])} on:select={handleSelect}/>
    {/if}
    <!-- show linked routes -->
    {#if oneToMany && value instanceof Array && value.length>0}
        {#each value as data (data)}
            <LinkedRoute {blockData} {data} on:remove={removeLinkedObject}/> 
        {/each}
    <!-- show linked route just one -->
    {:else if !oneToMany && value}
        <LinkedRoute {blockData} data={value} on:remove={removeLinkedObject}/> 
    {/if}
</div>


<style lang="scss">
    .container{
        border-radius: 5px;
        box-shadow: 0 0 1px 1px var(--textColor);
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
        color: var(--textColor);
        max-height: 45px;
        transition: all ease-in-out 0.5s;
    }
    .container.heightClass{
        max-height: 400px;
    }
    input{
        all: unset;
        font-size: 14px;
        font-weight: 400;
    }
    input::placeholder{
        font-size: 14px;
        font-weight: 400;
    }
    .error{
        background-color: #cc7d7d30;
    }
    .error > input::placeholder{
        color: var(--errorColor);
    }
    .focus{
        box-shadow: 0 0 1px 1px var(--mainColor);
    }
</style>