<script lang="ts">
    export let items:string[]
    export let value:string = items.length>0 ? items[0] : ""
    import Link from "./Link.svelte";
</script>

<div class="links">
    {#each items as item}
        <Link bind:currentValue={value} {item}/>
    {/each}
</div>

<style lang="scss">
    .links{
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        background-color: rgba(0,0,0,.1);
        border: 1.5px solid var(--borderColor);
        padding: 10px;
        border-radius: 10px;
    }
</style>