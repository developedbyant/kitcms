<script lang="ts">
    export let routeID:string
    export let objects:{ [key:string]:any }[]
    export let deletingObjectID:string
    import RouteObject from "./RouteObject.svelte";
</script>

<div class="objects">
    {#each objects as object}
        <RouteObject {deletingObjectID} {routeID} {object} on:delete />
    {/each}
</div>

<style>
    .objects{
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    /* mobile */
    @media(max-width:700px){
        .objects{
            flex-direction: column;
        }
    }
</style>