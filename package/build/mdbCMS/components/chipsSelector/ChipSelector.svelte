<script lang="ts">
    export let values:string[]
    export let selected:string = values[0]
    import Chip from "./Chip.svelte";
    /** Select new chip */
    const handleSelect = (e:any)=>selected = e.detail
</script>

<div class="chips">
    {#each values as value }
        <Chip {selected} text={value} on:select={handleSelect}/>
    {/each}
</div>

<style lang="scss">
    .chips{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
    }
</style>