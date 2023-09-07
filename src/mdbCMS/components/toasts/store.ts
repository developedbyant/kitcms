import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
export * as Toasts from "./Toasts.svelte"

/** Object returned from toast */
export type ToastData = {
    type:"error" | "successful" | "neutral"
    msg:string
    id:number
    /** When to remove the toast */
    removeIn?:number|"never"
    title?:string
    /** Use to add close class before removing toast */
    closedClass?:boolean
}
/** Data needed to create new toast */
export type ToastLoad = Omit<ToastData,"id"|"closedClass">

/** Toast store */
export const toastsStore:Writable<ToastData[]> = writable([])

/** Create/Add new toast */
export function createToast(data:ToastLoad){
    // Use title is it was provided, if not use type as title
    const title = data.title ? data.title : data.type
    const toastID = Date.now()
    // update current toasts
    toastsStore.update(oldData=>{
        oldData = [{...data,id:toastID,title},...oldData]
        return oldData
    })
    // auto remove after 4 seconds, if user did not provided removeIn param
    const removeIn = (data.removeIn && typeof data.removeIn === "number") ? data.removeIn : (data.removeIn && data.removeIn === "never") ? data.removeIn : 4000
    // Only run if toast was not set to never remove
    if(removeIn!=="never"){
        setTimeout(async()=>{
            // Add closed class for animation
            toastsStore.update(toasts=>{
                for(const toast of toasts){
                    if(toastID===toast.id){
                        toast['closedClass'] = true
                    }
                }
                return toasts
            })
            // Remove after 500 milliseconds
            await new Promise(r=>setTimeout(r,500))
            toastsStore.update(data=>data.filter(d=>d.id!==toastID))
        },removeIn)
    }
  
}

/** Remove toast */
export function removeToast(toastData:ToastData){
    toastsStore.update(data=>data.filter(d=>d.id!==toastData.id))
}