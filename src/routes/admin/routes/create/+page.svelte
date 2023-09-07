<script lang="ts">
    import RouteViewer from "mdbCMS/components/shared/RouteViewer.svelte";
    import type { RouteLoad } from "mdbCMS/types";
    let routeData:RouteLoad = {
        id: "",
        title: "",
        description: "",
        searchAbleKeys: [],
        blocks: [],
        updatedAt: new Date
    }
</script>

<RouteViewer {routeData} />
