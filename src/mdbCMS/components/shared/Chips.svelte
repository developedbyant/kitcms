<script lang="ts">
    export let values:string[]
    export let config:{bg:string,color:string} = { bg:"var(--buttonBg2)",color:"var(--buttonColor2)"}
    import { createEventDispatcher } from "svelte";
    const dispatcher = createEventDispatcher()
    let style = `
        background-color:${config.bg};
        color:${config.color};
    `
</script>

<div class="chips">
    {#each values as text }
        <button {style} class="chip" on:click={()=>dispatcher("select",text)}>
            {text}
        </button>
    {/each}
</div>

<style>
    .chips{
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    .chip{
        all: unset;
        flex-grow: 1;
        cursor: pointer;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        transition: all ease-in-out 0.4s;
        animation: fadeIn ease 0.6s;
    }
    .chip:hover{
        transform: scale(1.01);
        opacity: 80%;
        color: var(--errorColor);
    }
    @keyframes fadeIn{
        from { opacity: 0; }
        to { opacity: 100%; }
    }
</style>