<script lang="ts">
    export let links:{ text:string,href:string }[]
    import Link from "./Link.svelte";
</script>

<div class="links">
    {#each links as link}
        <Link {link}/>
    {/each}
</div>

<style lang="scss">
       .links{
        display: flex;
        align-items: center;
        /* justify-content: space-between; */
        gap: 10px;
        background-color: rgba(0,0,0,.1);
        border: 1.5px solid var(--borderColor);
        padding: 10px;
        border-radius: 10px;
    }
</style>