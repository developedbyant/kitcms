<script lang="ts">
    import PageTitle from "svelteCMS/components/shared/PageTitle.svelte";
    import Routes from "svelteCMS/components/routes/Routes.svelte";
    import { page } from "$app/stores";
    import utils from "svelteCMS/lib/utils";
    import { createToast } from "svelteCMS/components/toasts/store";
    import NoResult from "svelteCMS/components/shared/NoResult.svelte";
    import type { ApiRouteDelete, RouteData } from "svelteCMS/types";
    $: query = $page.url.searchParams.get("query")
    $: routes = query ? $page.data.svelteCMS.routes.filter(data=>data.id.match(new RegExp(query!,"i"))) : $page.data.svelteCMS.routes
    /** the route that currently being deleted */
    let deletingRouteID:string = ""
    /** Delete route when delete event is fired up */
    async function deleteRoute(e:any){
        const routeData:RouteData = e.detail
        deletingRouteID = routeData.id // set route id being deleted
        const apiLoad:ApiRouteDelete['input'] = routeData
        const apiResponse:ApiRouteDelete['output'] = await utils.apiRequest("/admin/api/routes/delete",apiLoad)
        // wait 500 milliseconds for better user experience
        await utils.wait(1000)
        // show api message
        createToast({ type:apiResponse.error ? "error" : "successful",msg:apiResponse.message })
        // if route was delete, remove route from current routes list
        if(!apiResponse.error){
            const newRoutes = routes.filter(data=>data.id!==routeData.id)
            // set new routes list
            routes = [...newRoutes]
        }
        // reset route id being deleted
        deletingRouteID = ""
    }
</script>

<PageTitle title="Routes" showGoBack link={{ href:"/admin/routes/create",text:"Create"}} />
{#if routes.length===0}
    <NoResult title="No routes" subTitle="No routes were founded" link={{ href:"/admin/routes/create",text:"Create" }}/>
{:else}
    <Routes {routes} {deletingRouteID} on:delete={deleteRoute}/>
{/if}