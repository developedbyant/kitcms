<script lang="ts">
    export let allowRm:boolean = true
    export let editAble:boolean = true
    export let addingKeyObject:boolean = false
    export let value:{key:string,value:string}[]
    import { createEventDispatcher } from "svelte";
    import utils from "svelteCMS/lib/utils";
    import { createToast } from "svelteCMS/components/toasts/store";
    import KeyObject from "./KeyObject.svelte";
    import NewKeyObject from "./NewKeyObject.svelte";
    const dispatch = createEventDispatcher()

    /** remove item from list */
    function removeItem(e:any){
        const itemData:{key:string,value:string} = e.detail
        if(allowRm) value = [...value.filter(data=>data.value!==itemData.value&&data.key!==itemData.key)]
        dispatch("remove",itemData)
    }

    /** handle new key object added */
    function handleNewKeyObject(e:any){
        const keyObjectData:{key:string,value:string} = e.detail
        const validatorErrors = utils.validateInputs(keyObjectData)
        if(validatorErrors.length>0){
            createToast({ type:"error",msg:validatorErrors[0].message }) ; return
        }
        // check if value and key already exist, if not add to value
        const exists = value.find((data:{key:string,value:string})=>data.key===keyObjectData.key&&data.value===keyObjectData.value)
        if(exists){
            createToast({ type:"error",msg:`key and value most be unique` }) ; return
        }
        // add key object
        value = [keyObjectData,...value]
        addingKeyObject = false
    }
</script>

<!-- add new key object -->
{#if addingKeyObject}
    <NewKeyObject on:add={handleNewKeyObject}/>
{/if}
<!-- show key objects -->
{#if value.length>0}
    <div class="keyObjects">
        {#each value as data }
            <KeyObject {editAble} bind:data on:remove={removeItem}/>
        {/each}
    </div>
{/if}

<style lang="scss">
    .keyObjects{
        display: flex;
        flex-wrap: wrap;
        /* flex-direction: column; */
        gap: 10px;
        background-color: var(--blurBg);
        padding: 10px;
        border: 1.5px solid var(--borderColor);
        border-radius: 15px;
    }
</style>