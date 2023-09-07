<script lang="ts">
    export let data:PageData
    import utils from "mdbCMS/lib/utils";
    import { createToast } from "mdbCMS/components/toasts/store";
    import PageTitle from "mdbCMS/components/shared/PageTitle.svelte";
    import Users from "mdbCMS/components/users/Users.svelte";
    import Pagination from "mdbCMS/components/shared/Pagination.svelte";
    import NoResult from "mdbCMS/components/shared/NoResult.svelte";
    import type { PageData } from "./$types";
    import type { UserData,ApiUserDelete } from "mdbCMS/types";
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
    <Pagination basePath="/admin/users" morePages={users.length>=data.mdbCMS.appData.usersPerPage}/>
{/if}