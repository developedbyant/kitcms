<script lang="ts">
    export let data:PageData
    import RouteViewer from "svelteCMS/components/shared/RouteViewer.svelte";
    import type { PageData } from "./$types";
    let routeData = data.routeData
</script>

<RouteViewer {routeData} isNewRoute={false}/>
