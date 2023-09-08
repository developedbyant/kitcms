
<script lang="ts">
    export let link: { text: string; href: string };
    import { page } from "$app/stores";
    $:active = $page.url.pathname === link.href;
</script>

<a href={link.href} class="link" class:active>
    {link.text}
</a>

<style lang="scss">
    .link {
        /* width: 100%; */
        width: fit-content;
        text-decoration: none;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px 10px;
        border-radius: 50px;
        box-shadow: 1px 2px 3px var(--shadow);
        background-color: var(--cardBg);
        color: var(--cardColor);
        font-size: 14px;
        font-weight: 600;
        transition: all ease 0.3s;
        &:hover,&.active {
            cursor: pointer;
            background-color: var(--buttonBg);
            color: var(--buttonColor);
        }
    }
</style>