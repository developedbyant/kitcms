<script lang="ts">
    export let open:boolean
    export let maxWidth:string = "500px"
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher()
    let closed:boolean = false
    /** Close modal */
    function closeMe(){
        closed = true
        setTimeout(()=>{
            closed = false ; open=false
            dispatch("closed")
        },400)
    }
    /** Handle click on modal */
    function onModalClick(e:MouseEvent,close?:boolean){
        // Close modal
        if(close){ closeMe() ; return }
        // Click modal if modal is clicked
        const targetElement = e.target as HTMLDivElement
        const closeModal = "data-modal" in targetElement.attributes
        if(closeModal) closeMe() 
    }
</script>

{#if open}
    <div class="modal" class:closed role="none" data-modal on:click={onModalClick}>
        <div class="content" style="max-width: {maxWidth};">
            <slot />
        </div>
    </div>
{/if}

<style>
    .modal{
        width: 100%;
        height: 100vh;
        background-color: rgba(0,0,0,.2);
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        animation: onOpenModal 0.3s;
        top: 0;
        left: 0;
        z-index: 10;
        padding: 10px;
    }
    .content{
        max-height: 95vh;
        overflow-y: scroll;
        width: 100%;
        /* transition */
        transition: transform ease 0.2s;
        animation: onOpenContent 0.2s;
    }
    .content::-webkit-scrollbar{ display: none; }
    .modal.closed{
        animation: onClosedModal 0.4s;
    }
    .modal.closed > .content{
        transform: scale(0.0);
    }
    @keyframes onOpenContent{
        from{ transform: scale(0.0); }
        to{ transform: scale(1) }
    }
    @keyframes onOpenModal{
        from{ opacity: 0%; }
        to{ opacity: 100%; }
    }
    @keyframes onClosedModal{
        from{ opacity: 100%; }
        to{ opacity: 0%; }
    }
</style>