<script lang="ts">
    export let data:PageData
    import type { PageData } from "./$types";
    $: tags = data.tags
</script>

<div class="tags">
    {#each tags as tag }
        <div class="tag">{tag.slug}</div>
    {/each}
</div>

<style lang="scss">
    .tags{
        display: flex;
        gap: 10px;
        padding: 20px;
    }
    .tag{
        padding: 10px 20px;
        border-radius: 5px;
        background-color: var(--appBg);
        color: var(--textColor);
    }
</style>