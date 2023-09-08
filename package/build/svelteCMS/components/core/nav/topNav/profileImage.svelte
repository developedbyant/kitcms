<script lang="ts">
    import imageSrc from "svelteCMS/images/user.png"
    export let src:string = imageSrc
    export let alt:string = "user"
    import { page } from "$app/stores";
    let href = "/admin/settings"
    $: active = $page.url.pathname===href
</script>

<a {href} class="image" class:active>
    <img src={src} {alt}>
</a>

<style lang="scss">
    .image{
        all: unset;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 40px;
        width: 40px;
        height: 40px;
        box-shadow: var(--shadow);
        margin-left: 20px;
        border-radius: 5px;
        overflow: hidden;
        // Hover animation
        transition: all ease 0.2s;
        &:hover{ transform: scale(1.05) }
        // Images
        img{
            object-fit: cover;
            object-position: center;
            width: 100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
            pointer-events: none;
        }
    }
    .image.active{
        box-shadow: 0 0 0px 1px var(--mainColor);
    }
</style>