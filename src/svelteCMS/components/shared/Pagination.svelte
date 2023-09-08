<script lang="ts">
    export let basePath:string
    export let morePages:boolean
    import { page } from "$app/stores";
    import ArrowLeftIcon from "svelteCMS/icons/ArrowLeft.svelte";
    import ArrowRightIcon from "svelteCMS/icons/ArrowRight.svelte";
    $: params = $page.url.searchParams.get("query") ? `&query=${$page.url.searchParams.get("query")}` : ""
    $: currentPage = Number($page.url.searchParams.get("page")) || 1
</script>

<ul class="pagination">
    {#if currentPage>1} 
        <a href="{basePath}?page={currentPage-1}{params}" data-sveltekit-noscroll class="btn prev"><ArrowLeftIcon /></a>
        <a href="{basePath}?page={currentPage-1}{params}" data-sveltekit-noscroll class="btn">{currentPage-1}</a>
    {/if}
    <a href="{basePath}?page={currentPage}{params}" data-sveltekit-noscroll class="btn active">{currentPage}</a>
    {#if morePages}
        <a href="{basePath}?page={currentPage+1}{params}" data-sveltekit-noscroll class="btn">{currentPage+1}</a>
        <a href="{basePath}?page={currentPage+1}{params}" data-sveltekit-noscroll class="btn next"><ArrowRightIcon /></a>
    {/if}
</ul>

<style lang="scss">
    .pagination{
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin: 25px 0;
    }
    .btn{
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgb(250 250 250);
        color: #283944;
        fill: #283944;
        padding: 5px;
        width: 40px;
        height: 40px;
        border-radius: 5px;
        transition: transform ease-in-out 0.3s;
    }
    .btn.active{
        background-color: var(--buttonBg);
        color: var(--buttonColor);
        border: 1px solid var(--buttonColor);
    }
    .prev:hover,.next:hover{
        transform: scale(1.1);
    }
</style>