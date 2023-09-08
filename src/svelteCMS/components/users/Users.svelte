<script lang="ts">
    export let showDel:boolean = true
    export let users:UserData[]
    import User from "./User.svelte";
    import type { UserData } from "svelteCMS/types"
</script>

<div class="users">
    {#each users as user (user._id)}
        <User {user} on:delete {showDel}/>
    {/each}
</div>

<style lang="scss">
    .users{
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
    }
    @media(max-width:700px){
        .users{
            gap: 10px;
        } 
    }
</style>