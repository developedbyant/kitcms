<script lang="ts">
    import Search from "./Search.svelte";
    import ProfileImage from "./profileImage.svelte";
</script>

<header class="topNav">
    <Search />
    <ProfileImage />
</header>

<style lang="scss">
    .topNav{
        position: sticky;
        top: 0;
        z-index: 6;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: var(--blurBg);
        border: 1px solid var(--borderColor);
        box-shadow: 0 1px 4px var(--shadow);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        border-radius: 10px;
        padding: 10px;
        height: 65px;
    }
</style>