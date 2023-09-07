<script lang="ts">
    export let show:boolean
    export let position:"tr"|"tl"|"br"|"bl" = "tr"
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher()
</script>

{#if show}
    <div class="confirm {position}">
        <button on:click={()=>{ dispatch('confirm',true) ; show=false }}>
            Confirm
        </button>
        <button on:click={()=>{ dispatch('confirm',false) ; show=false }}>
            Cancel
        </button>
    </div>
{/if}


<style>
    .confirm{
        position: absolute;
        display: flex;
        align-items: center;
        background-color: var(--antiAppBg);
        padding: 5px;
        border-radius: 5px;
        border: 1.5px solid rgba(0,0,0,.3);
    }
    button{
        cursor: pointer;
        padding: 5px 10px;
        font-size: 12px;
        font-weight: 500;
        color: white;
        border-radius: 5px;
        border: none;
    }
    button:nth-child(1){
        margin-right: 5px;
        background-color: #cc7d7d;
    }
    button:nth-child(2){
        margin-left: 5px;
        background-color: #4f4f4f;
    }
    /* top right */
    .confirm.tr{
        bottom: calc(100% + 10px);
        right: 0;
    }
    /* top left */
    .confirm.tl{
        bottom: calc(100% + 10px);
        left: 0;
    }
    /* bottom right */
    .confirm.br{
        top: calc(100% + 10px);
        right: 0;
    }
    /* bottom left */
    .confirm.bl{
        top: calc(100% + 10px);
        left: 0;
    }
</style>