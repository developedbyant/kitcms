<script lang="ts">
    export let selected:string
    export let text:string
    import { createEventDispatcher } from "svelte";
    const dispatcher = createEventDispatcher()
    $: active = selected===text
</script>

<button class="chip" class:active on:click={()=>dispatcher("select",text)}>
    {text}
</button>

<style>
    .chip{
        all: unset;
        text-align: center;
        flex-grow: 1;
        /* width: calc(100% / 6 - 29px); */
        cursor: pointer;
        padding: 5px 10px;
        border-radius: 4px;
        background-color: var(--antiAppBg);
        color: var(--textColor);
        font-size: 12px;
        font-weight: 500;
        transition: all ease-in-out 0.4s;
        animation: fadeIn ease 0.6s;
    }
    .chip.active,.chip:hover{
        background-color: var(--buttonBg);
        color: var(--buttonColor);
    }
    @keyframes fadeIn{
        from { opacity: 0; }
        to { opacity: 100%; }
    }
</style>