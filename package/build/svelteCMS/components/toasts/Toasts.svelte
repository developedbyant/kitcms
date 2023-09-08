<script lang="ts">
    export let rounded:boolean = true
    export let size:"s"|"m"|"l"|"xl" = "s"
    export let position:"tr"|"tl"|"br"|"bl" = "tr"
    import { fade } from "svelte/transition";
    import { toastsStore } from "./store";
    import Child from "./Child.svelte";
</script>

{#if $toastsStore.length>0}
    <div class="toasts {position}" in:fade>
        {#each $toastsStore as toast (toast.id)}
            <Child {toast} {rounded} {size}/>        
        {/each}
    </div>
{/if}


<style>
    .toasts{
        overflow: hidden;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        position: fixed;
        max-height: 100vh;
        overflow-y: scroll;
        z-index: 100;
    }
    /* top right */
    .toasts.tr{
        top: 0px;
        right: 0px;
    }
    /* top left */
    .toasts.tl{
        top: 0px;
        left: 0px;
    }
    /* bottom right */
    .toasts.br{
        bottom: 0px;
        right: 0px;
    }
    /* bottom left */
    .toasts.bl{
        bottom: 0px;
        left: 0px;
    }
    .toasts::-webkit-scrollbar {
        display: none;
    }
</style>