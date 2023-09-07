<script lang="ts">
    export let title:string
    export let subTitle:string
    export let link:{ text:string,href:string } | string | undefined = undefined
</script>

<div class="no-result">
    <h2>{title}</h2>
    <h3>{subTitle}</h3>
    {#if link && typeof link === "string"}
        <button class="btn" on:click>
            {link}
        </button>
    {:else if link && typeof link === "object"}
        <a href={link.href} data-sveltekit-preload-data class="btn" on:click>
            {link.text}
        </a>
    {/if}
</div>

<style>
    .no-result{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        border-radius: 5px;
        background-color: var(--antiAppBg);
        color: var(--textColor);
        box-shadow: var(--shadow);
        margin-bottom: 20px;
        text-align: center;
    }
    h2{
        font-size: 40px;
        font-weight: 900;
        text-transform: uppercase;
        margin-bottom: 5px;
        -webkit-text-stroke: 1px var(--textColor);
    }
    h3{
        font-size: 25px;
        font-weight: 600;
        text-transform: uppercase;
        margin-bottom: 7px;
    }
    .btn{
        text-decoration: none;
        font-size: 15px;
        font-weight: 400;
        padding: 10px 20px;
        border-radius: 50px;
        background-color: var(--buttonBg);
        color: var(--buttonColor);
        box-shadow: var(--shadow);
    }
    @media(max-width:700px){
        h2{
            font-size: 30px;
        }
        h3{
            font-size: 15px;
        }
        .btn{
            font-size: 14px;
            padding: 7px 10px;
        }
    }
</style>