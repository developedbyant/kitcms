<script lang="ts">
    export let blockData:RouteBlockData
    import utils from "svelteCMS/lib/utils";
    import { createEventDispatcher } from "svelte";
    import Input from "../input/Input.svelte";
    import ToggleSwitch from "../shared/ToggleSwitch.svelte";
    import Button from "../shared/Button.svelte";
    import KeyIcon from "svelteCMS/icons/KeyFile.svelte"
    import type { RouteBlockData } from "svelteCMS/types";
    import { createToast } from "../toasts/store";
    const dispatch = createEventDispatcher()
    let data:{[key:string]:any} = {}
    let keys = Object.entries(blockData.objectKeys!)
    // set default values
    for(const [key,type] of keys){
        data[key] = type==="boolean" ? true : type==="date" ? new Date() : type==="number" ? 0 : ""
    }

    /** add new object */
    function addObject(){
        const validatorErrors = utils.validateInputs(data)
        // show error if got any validator error
        if(validatorErrors.length>0){
            createToast({ type:"error",msg:validatorErrors[0].message }) ; return
        }
        // else send custom event
        dispatch("addObject",data)
    }
</script>

<div class="items">
    {#each keys as [key,type]}  
        <div class="item">
            <span class="title"><KeyIcon size=17 />{key}</span>
            {#if type==="boolean"}
                <ToggleSwitch bind:checked={data[key]}/>
            {:else}
                <Input type={type} bind:value={data[key]}/>
            {/if}
        </div>
    {/each}
    <Button text="Add" on:click={addObject}/>
</div>

<style lang="scss">
    .items{
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        gap: 5px;
        background-color: var(--cardBg);
        border: 1px solid var(--borderColor);
        padding: 5px;
        border-radius: 3px;
    }
    .item{
        flex: 1;
        display: flex;
        align-items: center;
        gap: 10px;
        background-color: var(--appBg);
        padding: 5px 10px;
        border-radius: 5px;
    }
    .title{
        flex: 1;
        display: flex;
        align-items: center;
        gap: 3px;
        fill: var(--iconColor);
        font-size: 15px;
        font-weight: 400;
        text-transform: capitalize;
    }
</style>