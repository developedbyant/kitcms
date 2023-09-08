<script lang="ts">
    export let data:PageData
    import ObjectViewer from "svelteCMS/components/objectViewer/ObjectViewer.svelte"
    import type { PageData } from "./$types"
    let routeData = data.routeData
    let objectData = data.objectData
</script>

<ObjectViewer isNewObject={false} {routeData} {objectData}/>