<script lang="ts">
    export let margin:string = "0 0 0 0"
    export let title:string
    export let rounded:boolean = false
    export let btnText:string|undefined = undefined
    export let link:{href:string,text:string,disableLoad?:"yes"|"no"}|undefined = undefined
    export let showGoBack:boolean = false
    import GoBackIcon from "svelteCMS/icons/ArrowLeft.svelte"
    import { appStore } from "svelteCMS/lib/stores";
</script>

<div class="title" class:rounded style="margin: {margin};">
    {#if showGoBack}
        <a href={$appStore.goBackHref} data-label="Go back" data-label-right class="goBack">
            <GoBackIcon />
        </a>
    {/if}
    <h2>{title}</h2>
    {#if btnText && !link}
        <button class="link" on:click>{btnText}</button>
    {/if}
    {#if link}
        <a href={link.href} class="link" data-sveltekit-preload-data={link.disableLoad==="yes"?"off":"hover"}>
            {link.text}
        </a>
    {/if}
</div>

<style lang="scss">
    .title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--headerColor);
    }
    h2{
        font-weight: 900;
        font-size: 30px;
        text-transform: uppercase;
        flex: 1;
    }
    .goBack{
        flex: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: fit-content;
        background-color: var(--buttonBg);
        fill: var(--buttonColor);
        padding: 5px;
        border-radius: 50%;
        box-shadow: var(--shadow);
        margin-right: 10px;
    }
    .link{
        text-decoration: none;
        cursor: pointer;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        color: var(--buttonColor);
        background-color: var(--buttonBg);
        box-shadow: var(--shadow);
        transition: transform ease-in-out 0.3s;
        &:hover{
            transform: scale(1.05);
        }
    }
    /* make link rounded */
    .title.rounded > .link{
        border-radius: 50px;
    }
    @media(max-width:700px){
        h2{
            font-size: 25px;
        }
        .link{
            padding: 4px 8px;
        }
    }
</style>