<script lang="ts">
    import RouteViewer from "svelteCMS/components/shared/RouteViewer.svelte";
    import type { RouteLoad } from "svelteCMS/types";
    let routeData:RouteLoad = {
        id: "",
        singularID: "",
        title: "",
        description: "",
        searchAbleKeys: [],
        blocks: [],
        updatedAt: new Date
    }
</script>

<RouteViewer {routeData} />
