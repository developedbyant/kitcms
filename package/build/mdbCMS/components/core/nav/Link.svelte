<script lang="ts">
    export let external:boolean  = false
    export let icon:any  = undefined
    export let roundedIcon:boolean = false
    export let href:string
    export let text:string
    /** Remove before animation that shows when user hover link to the left of the link */
    export let rmBeforeClass:boolean = false
    import { page } from "$app/stores";
    /** Check if href is the same as current url.pathname
     * if not check if they belong to the same folder example:admin/users users is the folder */
    $: samePathname = href === $page.url.pathname
    $: sameFolderParent = href.split("/")[2] === $page.url.pathname.split("/")[2] && href!=="/"
    $: active = samePathname ? true : sameFolderParent
</script>

<li>
    <a {href} class="link" class:active class:rmBeforeClass target={external?"_blank":""}>
        {#if icon}
            <div class="icon" class:roundedIcon>
                <svelte:component this={icon} />
            </div>
        {/if}
        <span class="text">{text}</span>
    </a>
</li>

<style lang="scss">
    .link{
        position: relative;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 18px;
        font-weight: 400;
        padding: 5px 10px;
        color: var(--navLinkColor);
        background-color: transparent;
        border: 1px solid transparent;
        transition: background-color ease 0.4s;
    }
    .link::after{
        content: "";
        position: absolute;
        left: -10px;
        background-color: transparent;
        height: 0px;
        width: 5px;
        border-radius: 20px;
        transition: all ease 0.5s;
    }
    .link.active{
        background-color: var(--navLinkHoverBg);
        border-radius: 5px;
        border: 1px solid var(--borderColor);
    }
    .link.active::after,.link:hover::after{
        background-color: var(--mainColor);
        height: 100%;
        border-radius: 2px;
    }
    // Remove before animation that shows when user hover link to the left of the link
    .link.rmBeforeClass::after,.link.rmBeforeClass:hover::after{ background-color: transparent; }
    .icon{
        display: flex;
        align-items: center;
        justify-content: center;
        fill: var(--iconColor);
    }
    .icon.roundedIcon{
        background-color: rgba(0,0,0,10%);
        border-radius: 50%;
        padding: 3px;
    }
    // on mobile
    @media(max-width:700px){
        .link{
            border-radius: 0;
            padding: 3px 10px;
            flex-direction: column;
            font-size: 12px;
            gap: 2px;
            &.active{
                border-radius: 0;
            }
        }
    }
</style>