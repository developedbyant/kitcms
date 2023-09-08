export default {
    user:{
        "role": "admin",
        "firstName": "Root",
        "lastName": "Admin",
        "email": "root@sveltecms.dev",
        "password": "root",
        "image": null,
        "createdAt": "2023-08-21T21:38:26.232Z"
    },
    hooksFile:`import svelteCMSHooks from "svelteCMS/lib/hooks.server"
import { sequence } from '@sveltejs/kit/hooks';
import { handle as projectHooks } from "./projectHooks.server"
import type { Handle } from '@sveltejs/kit';
export const handle:Handle = sequence(svelteCMSHooks,projectHooks)`,
    hooksFileCms:`import svelteCMSHooks from "svelteCMS/lib/hooks.server"
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
export const handle:Handle = sequence(svelteCMSHooks)`,
    layout:`<script>
    import { page } from "$app/stores";
    import ProjectLayout from "./ProjectLayout.svelte";
</script>

{#if $page.url.pathname.startsWith("/admin")}
    <slot />
{:else}
    <ProjectLayout>
        <slot/>
    </ProjectLayout>
{/if}`
}