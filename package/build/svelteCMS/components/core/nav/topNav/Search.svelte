<script lang="ts">
    import { goto } from "$app/navigation";
    import { navigating, page } from "$app/stores";
    import SearchIcon from "svelteCMS/icons/Search.svelte"
    let value:string = $page.url.searchParams.get("query") || ""
    $: routeID = $page.params.routeID
    $: pathname = $page.url.pathname
    $: searchData = routeID ? { search:"objects",routeID } : pathname==="/admin/routes" ? { search:"routes" } : pathname==="/admin/assets" ? { search:"assets" } : pathname==="/admin/users" ? { search:"users" } : { search:"routes" }
    $: placeholder = `Search ${searchData.search==="objects"?routeID:searchData.search}...`
    $: href = `/admin/${searchData.search==="objects" ? `routes/${routeID}` : searchData.search==="assets" ? "assets" : searchData.search==="users" ? "users" : "routes"}?query=${encodeURIComponent(value)}`
    /** handle key press on input */
    async function handleSearch(e:KeyboardEvent) {
        const run = e.code==="Enter" && value.trim().length >= 2
        // go to search path
        if(run){
            // add page to params if founded on url
            // const pageNumSearch = $page.url.searchParams.get("page")
            // href = pageNumSearch ? `${href}&page=${pageNumSearch}` : href
            goto(href,{ replaceState:true,keepFocus:true })
        }
    }
    // reset input value
    $: if($navigating && $navigating.type==="link") value=""
</script>

<div class="search">
    <div class="icon" data-label="Search">
        <SearchIcon />
    </div>
    <input type="search" {placeholder} bind:value on:keyup={handleSearch}>
</div>

<style lang="scss">
    .search{
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        fill: var(--iconColor);
        border-radius: 50px;
        border: 1px solid var(--borderColor);
        box-shadow: 2px 2px 2px var(--shadow);
        background-color: var(--searchBg);
        max-width: 300px;
        width: 100%;
    }
    .icon{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    input{
        border: none;
        height: -webkit-fill-available;
        background-color: transparent;
        width: 100%;
        font-size: 14px;
        font-weight: 500;
        color: var(--searchColor);
        &::placeholder{
            font-size: 14px;
            font-weight: 500;
            color: var(--searchColor);
        }
        &:focus{
            outline: none;
        }
    }
    .search:focus-within{
        box-shadow: 0 0 3px 0.2px var(--borderColor);
    }
</style>