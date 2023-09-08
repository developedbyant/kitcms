<script lang="ts">
    /** the route that currently being deleted */
    export let deletingRouteID:string = ""
    export let routes:RouteData[]
    export let showDel:boolean = true
    import type { RouteData } from "svelteCMS/types"
    import Route from "./Route.svelte";
</script>

<div class="routes">
    {#each routes as route (route.id)}
        <Route {deletingRouteID} {showDel} {route} on:delete/>
    {/each}
</div>

<style>
    .routes{
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
</style>