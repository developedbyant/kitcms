<script lang="ts">
    import"svelteCMS/global.css"
    import Toasts from "svelteCMS/components/toasts/Toasts.svelte";
</script>

<Toasts rounded={true}/>
<div class="app dark">
    <slot />
</div>

<style>
    .app{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: var(--appBg);
        min-height: 100vh;
        gap: 20px;
    }
</style>