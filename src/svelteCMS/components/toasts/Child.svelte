<script lang="ts">
    export let toast:ToastData
    export let rounded:boolean
    export let size:"s"|"m"|"l"|"xl"
    import { removeToast } from "./store";
    import type { ToastData } from "./store";
    import ErrorIcon from "./icons/Error.svelte";
    import SuccessfulIcon from "./icons/Successful.svelte";
    import NeutralIcon from "./icons/Neutral.svelte";
    const type:"successful"|"error"|"neutral" = toast.type
    let iconSize = size==="m" ? "20" : size==="l" ? "30" : size==="xl" ? "35" : "17"
    /** Use to add animation before closing toast */
    $: closed = toast.closedClass
    /** Add closed class to toast and remove after 200 milliseconds */
    function remove() {
        closed = true
        setTimeout(()=>removeToast(toast),200)
    }
</script>

<div class:closed class="toast {type} {size}" on:click={remove} role="none" style="border-radius: {rounded?'50px':'5px'};">
    <div class="icon">
        {#if type==="error"}
            <ErrorIcon size={iconSize}/> {:else if type==="successful"} <SuccessfulIcon size={iconSize}/> {:else} <NeutralIcon size={iconSize}/>
        {/if}
    </div>
    <p class="message">{toast.msg}</p>
</div>

<style>
    .toast{
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        fill: white;
        color: white;
        padding: 10px 15px;
        box-shadow: 1px 2px 3px var(--shadow);
        transition: transform ease-in-out 0.4s,max-height ease 0.2s,opacity ease 0.3s;
        animation: animateIn 0.4s;
        /* use for transition */
        max-height: 50px;
        opacity: 100%;
    }
    .toast:hover{
        transform: scale(1.05);
    }
    .toast.closed{
        max-height: 0px;
        opacity: 0%;
    }
    .icon{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .message{
        font-size: 14px;
        font-weight: 500;
    }
    .successful{
        background-color: #079E6D;
    }
    .error{
        background-color: #DB6D6D;
    }
    .neutral{
        background-color: var(--antiAppBg,#364152);
    }
    .toast.m > .message{ font-size: 19px; }
    .toast.l > .message{ font-size: 25px; }
    .toast.xl > .message{ font-size: 35px; }
    @keyframes animateIn{
        from{
            opacity: 0%;
            max-height: 0px;
        }
        to{
            opacity: 100%;
            max-height: 50px;
        }
    }
</style>