<script lang="ts">
    export let data:PageData
    import PageTitle from "mdbCMS/components/shared/PageTitle.svelte";
    import Stats from "mdbCMS/components/stats/Stats.svelte";
    import Assets from "mdbCMS/components/assets/assets.svelte";
    import NoResult from "mdbCMS/components/shared/NoResult.svelte";
    import type { PageData } from "./$types";
    const stats = [
        {name:"Routes", count:data.stats.routes, href:"/admin/routes"},
        {name:"Users", count:data.stats.users, href:"/admin/users"},
        {name:"Assets", count:data.stats.assets, href:"/admin/assets"},
    ]
    $: assets = data.assets
</script>

<PageTitle title="App stats" margin="15px 0 0 0"/>
<Stats {stats}/>
<!-- assets -->
{#if assets.length===0}
    <NoResult title="No assets" subTitle="No assets were found, please add some" link={{ href:"/admin/assets",text:"Upload asset"}} />
{:else}
    <PageTitle title="Lasted assets" link={{ text:"View more",href:"/admin/assets"}} margin="15px 0 0 0"/>
    <Assets {assets}/>
{/if}
