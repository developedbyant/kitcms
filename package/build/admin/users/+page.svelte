<script lang="ts">
    export let data:PageData
    import utils from "svelteCMS/lib/utils";
    import { createToast } from "svelteCMS/components/toasts/store";
    import PageTitle from "svelteCMS/components/shared/PageTitle.svelte";
    import Users from "svelteCMS/components/users/Users.svelte";
    import Pagination from "svelteCMS/components/shared/Pagination.svelte";
    import NoResult from "svelteCMS/components/shared/NoResult.svelte";
    import type { PageData } from "./$types";
    import type { UserData,ApiUserDelete } from "svelteCMS/types";
    $: users = data.users

    /** delete user */
    async function deleteUser(e:any) {
        const userData:UserData = e.detail
        const apiLoad:ApiUserDelete['input'] = userData
        const apiResponse:ApiUserDelete['output'] = await utils.apiRequest("/admin/api/users/delete",apiLoad)
        // show api response
        createToast({ type:apiResponse.error?"error":"successful",msg:apiResponse.message })
        // wait 1 second to show message
        await utils.wait(500)
        // if user was deleted, remove user from current users list
        if(!apiResponse.error){
            const newUsers = users.filter(data=>data._id!==userData._id)
            users = [...newUsers]
        }
    }
</script>

<PageTitle showGoBack title="Users" link={{ href:"/admin/users/create",text:"Create"}}/>
{#if users.length===0}
    <NoResult title="No users" subTitle="No users were founded" link={{ text:"Create one",href:"/admin/users/create"}}/>
{:else}
    <Users {users} on:delete={deleteUser}/>
    <Pagination basePath="/admin/users" morePages={users.length>=data.svelteCMS.appData.usersPerPage}/>
{/if}