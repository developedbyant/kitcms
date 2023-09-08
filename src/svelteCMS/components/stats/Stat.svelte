<script lang="ts">
    export let stat:{name:string, count:number, href:string};
    import { fade } from "svelte/transition";
</script>

<div class="stat" in:fade>
    <div class="progress">{stat.count}</div>
    <span class="title">{stat.name}</span>
    <a href={stat.href} data-sveltekit-preload-data class="link">View</a>
</div>

<style lang="scss">
    .stat{
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 5px;
        padding: 10px;
        background-color: var(--cardBg);
        border: 1px solid var(--borderColor);
        width: calc(100% / 3 - 10px);
    }
    .progress{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: var(--mainColor) solid 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: 900;
        background-color: white;
        color: var(--mainColor);
        padding: 10px;
    }
    .title{
        font-size: 15px;
        font-weight: 600;
        color: var(--cardColor);
        text-transform: capitalize;
    }
    .link{
        text-decoration: none;
        font-size: 13px;
        font-weight: 400;
        color: var(--buttonColor);
        background-color: var(--buttonBg);
        box-shadow: var(--shadow);
        padding: 5px 15px;
        border-radius: 50px;
    }
    // mobile
    @media(max-width:1000px){
        .stat{
            width: 100%;
        }
        .progress{
            width: 60px;
            height: 60px;
            font-size: 25px;
            font-weight: 700;
            border: var(--mainColor) solid 5px;
        }
        .title{
            font-size: 15px;
        }
    }
</style>