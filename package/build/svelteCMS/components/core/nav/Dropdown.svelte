<script lang="ts">
    export let icon:any  = undefined
    export let href:string
    export let text:string
    import Link from "./Link.svelte";
    import CaretIcon from "svelteCMS/icons/CaretDown.svelte"
    import { page } from "$app/stores";
    /** Indicate if dropdown is open or not */
    let open:boolean = false
    // when page navagate, close dropdown
    $: if($page.url.pathname) open = false
</script>

<a href="/admin/settings" class="dropdown" class:open>
    <Link {text} {href} {icon}/>
    <div class="icon" role="button" tabindex="0" on:pointerdown={()=>open=!open}>
        <CaretIcon size=16/>
    </div>
    <div class="links" class:open role="none" on:click={()=>open=false}>
        <slot />
    </div>
</a>


<style lang="scss">
    .dropdown{
        all: unset;
        display: flex;
        align-items: center;
        gap: 1px;
        position: relative;
        z-index: 10;
    }
    .icon{
        cursor: pointer;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        fill: var(--iconColor);
        background-color: rgba(0,0,0,5%);
        padding: 5px;
        border-radius: 50%;
        transition: all ease-in-out 0.3s;
    }
    .dropdown.open > .icon{
        fill: var(--buttonColor);
        background-color: var(--buttonBg);
    }
    .links{
        display: flex;
        flex-direction: column;
        gap: 5px;
        position: absolute;
        top: 0;
        left: calc(100% + 20px);
        background-color: var(--antiAppBg);
        box-shadow: 1px 2px 3px var(--shadow);
        border-radius: 5px;
        padding: 10px 15px;
        border: 1.5px solid var(--borderColor);
        // for transition
        opacity: 0%;
        pointer-events: none;
        transform: translateX(-40px);
        transition: all ease-in-out 0.2s;
    }
    // when dropdown icon is clicked/focus
    .links.open{
        opacity: 100%;
        pointer-events: all;
        transform: translateX(0);
    }
    :global(.icon svg){ pointer-events: none;}
</style>