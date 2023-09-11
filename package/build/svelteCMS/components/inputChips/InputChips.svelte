<script lang="ts">
    export let error:boolean = false
    export let placeholder:string = "Enter text..."
    export let values:string[]
    import Chip from "./Chip.svelte";
    let inputValue:string = ""
    let focus:boolean = false
    let input:HTMLInputElement
    $: heightClass = values.length > 0

    /** When click enter, create chip */
    function handleEnter(e:KeyboardEvent){
        const newChip = inputValue.trim()
        const chipExists = values.includes(newChip)
        // set error if values list is > 0  and if new input already exists
        if(values.length>0) error = chipExists
        // Only run is click enter and is there is not error and if input is not empty
        if(e.code==="Enter" && !chipExists && newChip!==""){
            values = [...values,newChip]
            // Reset
            input.value = ""
        }
    }

    /** Remove chip when click on it */
    function removeChip(e:any){
        const newValues = values.filter(data=>data!==e.detail)
        values = [...newValues]
    }
</script>

<div class="inputChips" class:error class:focus class:heightClass>
    <input class="mainInput" bind:this={input} bind:value={inputValue} {placeholder} required on:keyup={handleEnter} on:focusin={()=>focus=true} on:focusout={()=>focus=false}>
    {#if values.length>0}
        <div class="chips">
            {#each values as text }
                <Chip {text} on:remove={removeChip}/>
            {/each}
        </div>
    {/if}
</div>


<style lang="scss">
    .inputChips{
        background-color: var(--antiAppBg);
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
    .inputChips.heightClass{
        max-height: 400px;
    }
    .mainInput{
        all: unset;
        font-size: 14px;
        font-weight: 400;
    }
    .mainInput::placeholder{
        font-size: 14px;
        font-weight: 400;
    }
    .error{
        background-color: var(--errorBg);
    }
    .error > input::placeholder{
        color: var(--errorColor);
    }
    .focus{
        box-shadow: 0 0 1px 1px var(--mainColor);
    }
    .chips{
        display: flex;
        align-items: center;
        gap: 5px;
        flex-wrap: wrap;
    }
</style>