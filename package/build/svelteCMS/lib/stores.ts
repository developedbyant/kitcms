import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

/** App store about app */
export const appStore:Writable<{
    theme:"dark"|"light"
    goBackHref:string
}> = writable()

/** set meta tags */
export const metaTagsStore:Writable<{
    appName:string
    favicon?:string
    url?:string
    title?:string
    description?:string
    image?:string
    ogType?:"website"|"article"
}> = writable({ appName:"svelteCMS" })