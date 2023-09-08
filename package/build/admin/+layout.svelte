<script lang="ts">
    export let data:PageData
    import"svelteCMS/global.css"
    import { beforeNavigate } from "$app/navigation";
    import { page } from "$app/stores";
    import { appStore,metaTagsStore } from "svelteCMS/lib/stores";
    import utils from "svelteCMS/lib/utils";
    import MainNav from "svelteCMS/components/core/nav/Nav.svelte";
    import TopNav from "svelteCMS/components/core/nav/topNav/topNav.svelte";
    import Toasts from "svelteCMS/components/toasts/Toasts.svelte";
    // images
    import backdropImageSrc from "svelteCMS/images/backdrop.png"
    import faviconImageSrc from "svelteCMS/images/favicon.png"
    import type { PageData } from "./$types";
    import type { ApiSetTheme } from "svelteCMS/types"

    // set store value
    appStore.set({ goBackHref:$page.url.pathname,theme:data.svelteCMS.theme})
    // set go back href
    beforeNavigate(data=>{
        if(data.from) $appStore.goBackHref = data.from.url.pathname
    })

    /** Set theme */
    async function setTheme() {
        const apiLoad:ApiSetTheme['input'] = {}
        const response:ApiSetTheme['output'] = await utils.apiRequest("/admin/api/app/set-theme",apiLoad)
        // set return theme
        if(!response.error) $appStore.theme = response.data.theme
    }
    // theme
    $: theme = $appStore.theme
    $: url = $page.url.href
    $: appName = $metaTagsStore.appName
    $: favicon = $metaTagsStore.favicon ? $metaTagsStore.favicon : faviconImageSrc
    $: ogType = $metaTagsStore.ogType ? $metaTagsStore.ogType:"website" 
    $: title = $metaTagsStore.title ? `${$metaTagsStore.title} | ${appName}`:`${appName} | All in one svelte cms` 
    $: description = $metaTagsStore.description ? $metaTagsStore.description:"All in one cms for your svelte and sveltekit projects." 
    $: image = $metaTagsStore.image ? $metaTagsStore.image: backdropImageSrc
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
    <!-- Primary Meta Tags -->
    <title>{title}</title>
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content={ogType} />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={url} />
    <meta property="twitter:title" content="FinOnX | Finance on X" />
    <meta property="twitter:description" content={description} />
    <meta property="twitter:image" content={image} />
</svelte:head>

<Toasts rounded={false}/>
<div class="app" class:dark={theme==="dark"}>
    <MainNav on:themeChange={setTheme}/>
    <div class="content">
        <TopNav />
        <slot />
    </div>
</div>

<style lang="scss">
    .app{
        background-color: var(--appBg);
        color: var(--textColor);
        height: 100vh;
        width: 100%;
        display: flex;
    }
    .content{
        padding: 5px 10px;
        width: 100%;
        height: 100vh;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        gap: 15px;
        &::-webkit-scrollbar{ display: none;}
    }
</style>