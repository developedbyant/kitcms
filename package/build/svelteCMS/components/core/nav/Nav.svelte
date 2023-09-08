<script lang="ts">
    import Link from "./Link.svelte";
    import Dropdown from "./Dropdown.svelte";
    import ThemeToggle from "./ThemeToggle.svelte";
    // icons
    import HouseIcon from "svelteCMS/icons/House.svelte"
    import RoutesIcon from "svelteCMS/icons/Routes.svelte";
    import UsersIcon from "svelteCMS/icons/People.svelte";
    import SettingsIcon from "svelteCMS/icons/Gear.svelte"
    import AssetsIcon from "svelteCMS/icons/Images.svelte";
    // import PluginIcon from "svelteCMS/icons/Plugin.svelte";
    import PreviewIcon from "svelteCMS/icons/Display.svelte"
    import logoSrc from "svelteCMS/images/logo.png"
</script>

<header class="mainHeader">
    <nav class="mainNav">
        <div class="logo">
            <img src={logoSrc} alt="Logo">
            <span>CMS</span>
        </div>
        <ul class="navLinks">
            <Link text="Home" href="/admin" icon={HouseIcon} />
            <Link text="Routes" href="/admin/routes" icon={RoutesIcon} />
            <Link text="Assets" href="/admin/assets" icon={AssetsIcon} />
            <Link text="Users" href="/admin/users" icon={UsersIcon} />
            <Link text="Settings" href="/admin/settings" icon={SettingsIcon} />
            <Link text="Preview" href="/" icon={PreviewIcon} external/>
            <!-- <Dropdown text="More" href="/admin/test" icon={PluginIcon}>
                <Link text="Export" href="/admin/test" rmBeforeClass />
                <Link text="Import" href="/admin/test" rmBeforeClass />
                <Link text="Docs" href="/admin/test" rmBeforeClass />
            </Dropdown> -->
        </ul>
        <ThemeToggle on:themeChange/>
    </nav>
</header>

<style lang="scss">
    .mainHeader{
        height: 100vh;
        width: fit-content;
        padding: 10px;
        border-radius: 0 15px 15px 0;
        background-color: var(--navBg);
        box-shadow: 2px 0px 3px var(--shadow);
        border: 1.5px solid var(--borderColor);
    }
    .mainNav{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .logo{
        display: flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 20px;
        color: var(--headerColor);
        max-width: 30px;
        img{
            height: auto;
            width: 100%;
            object-fit: cover;
            object-position: center;
        }
        span{
            font-size: 40px;
            font-weight: 900;
        }
    }
    .navLinks{
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 15px;
        list-style: none;
    }
    // Mobile
    @media(max-width:700px){
        .mainHeader{ padding: 0;}
        .logo{
            max-width: 40px;
            justify-content: center;
            margin: 10px auto 20px auto;
        }
        .logo span{
            display: none;
        }
    }
</style>