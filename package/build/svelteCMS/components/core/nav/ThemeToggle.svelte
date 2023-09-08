<script lang="ts">
    import SunIcon from "svelteCMS/icons/Sun.svelte";
    import MoonIcon from "svelteCMS/icons/Moon.svelte";
    import { appStore } from "svelteCMS/lib/stores";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher()
    $: theme = $appStore.theme
    $: darkMode = $appStore.theme==="dark"
</script>

<button class="btn" class:darkMode on:click={()=>dispatch("themeChange")}>
    <div class="icon" class:rm={theme==="dark"}>
        <SunIcon />
    </div>
    <div class="icon" class:rm={theme==="light"}>
        <MoonIcon />
    </div>
</button>

<style lang="scss">
    .btn{
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        border-radius: 50px;
        padding: 5px;
        background-color: var(--appBg);
        border: 1px solid var(--borderColor);
        transition: box-shadow ease-in-out 0.3s;
        position: relative;
        &:hover{
            cursor: pointer;
            box-shadow: 0 0 3px 0.2px var(--borderColor);
        }
    }
    .icon{
        fill: var(--iconColor);
        width: 30px;
        height: 30px;
        padding: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
    }
    .btn::after{
        content: "";
        position: absolute;
        width: 30px;
        height: 30px;
        background-color: #fff13978;
        border: 1px solid var(--borderColor);
        border-radius: 50%;
        left: 4px;
        transition: all ease-in-out 0.2s;
    }
    // when dark mode is on
    .btn.darkMode::after{
        left: calc(100% - 35px);
        background-color: rgb(0 0 0 / 69%);
    }
    // on mobile
    @media(max-width:700px){
        .btn{
            width: 40px;
            height: 40px;
            justify-content: center;
            margin: 10px auto 10px auto;
        }
        .btn::after{
            display: none;
        }
        .icon.rm{
            display: none;
        }

    }
</style>