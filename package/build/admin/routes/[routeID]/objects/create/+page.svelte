<script lang="ts">
    export let data:PageData
    import ObjectViewer from "svelteCMS/components/objectViewer/ObjectViewer.svelte"
    import type { PageData } from "./$types"
    let routeData = data.routeData
</script>

<ObjectViewer {routeData}/>