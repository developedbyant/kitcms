<script lang="ts">
    export let text:string
    import { createEventDispatcher } from "svelte";
    const dispatcher = createEventDispatcher()
</script>

<button class="chip" on:click={()=>dispatcher("remove",text)}>
    {text}
</button>

<style>
    .chip{
        all: unset;
        cursor: pointer;
        padding: 5px 10px;
        border-radius: 4px;
        background-color: var(--buttonBg);
        color: var(--buttonColor);
        font-size: 12px;
        font-weight: 500;
        transition: all ease-in-out 0.4s;
        animation: fadeIn ease 0.6s;
    }
    .chip:hover{
        transform: scale(1.05);
        background-color: var(--errorBg);
        color: var(--errorColor);
    }
    @keyframes fadeIn{
        from { opacity: 0; }
        to { opacity: 100%; }
    }
</style>