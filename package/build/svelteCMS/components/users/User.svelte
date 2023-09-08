
<script lang="ts">
    export let showDel:boolean
    export let user:UserData
    import { createEventDispatcher } from "svelte"
    import { fade } from "svelte/transition";
    import Confirm from "svelteCMS/components/shared/Confirm.svelte"
    import type { UserData } from "svelteCMS/types"
    const dispatch = createEventDispatcher()
    $: imageSrc = user.image ? user.image.src : "/images/no-asset.png"
    let showConfirm:boolean = false
    /** Hide or show confirmation */
    function toggleConfirm(){
        showConfirm = !showConfirm
    }
</script>

<div class="user" in:fade>
    <div class="image">
        <img src={imageSrc} alt={user.firstName}>
        <h2 class="title">{user.email}</h2>
    </div>
    <div class="actions">
        <Confirm bind:show={showConfirm} on:confirm={ (e)=>{if(e.detail){dispatch("delete",user)}} }/>
        <a href="/admin/users/{user._id}/update" class="action">Edit</a>
        {#if showDel}
            <button class="action bad" on:click={toggleConfirm}>
                {#if showConfirm} Cancel {:else} Delete {/if}
            </button>
        {/if}
    </div>
</div>

<style lang="scss">
    .user{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: calc(100% / 6 - 17px);
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 1px 2px 3px var(--shadow);
        background-color: var(--antiAppBg);
        border: 2px solid var(--borderColor);
    }
    .image {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }
    }
    .title{
        position: absolute;
        bottom: 0; left: 0;
        padding: 5px;
        width: 100%;
        font-size: 15px;
        font-weight: 400;
        text-align: center;
        background-color: var(--appBg);
        color: var(--textColor);
    }
    .actions{
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 5px;
        position: relative;
    }
    .action{
        text-decoration: none;
        flex: 1;
        border: none;
        cursor: pointer;
        color: var(--buttonColor);
        background-color: var(--buttonBg);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        padding: 8px 0;
        font-size: 10px;
        font-weight: 400;
        box-shadow: 1px 2px 2px  var(--shadow);
        text-transform: uppercase;
        &.bad{
            background-color: #a86868;
        }
    }
    @media(max-width:1000px){
        .user{
            width: calc(100% / 3 - 17px);
        } 
    }
    @media(max-width:700px){
        .user{
            width: calc(100% / 2 - 5px);
        } 
    }
</style>