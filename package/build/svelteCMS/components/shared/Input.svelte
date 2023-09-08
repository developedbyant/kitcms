<script lang="ts">
    export let placeholder:string = "Input..."
    export let value:string = ""
    export let error:boolean = false
    export let rounded:boolean = false
    export let icon:any|undefined = undefined
</script>

<div class="wrapper" class:error class:rounded>
    {#if icon}
        <div class="icon">
            <svelte:component size=15 this={icon} />
        </div>
    {/if}
    <input type="input" bind:value {placeholder} required={true}>
</div>

<style>
    .wrapper{
        flex: 1;
        background-color: var(--antiAppBg);
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 10px;
        border-radius: 5px;
        box-shadow: 1px 2px 3px var(--shadow);
        color: var(--textColor);
        transition: all ease 0.3s;
    }
    .wrapper:hover, .wrapper:focus-within{
        transform: scale(1.01);
        box-shadow: 0 0 2px 2px var(--shadow);
    }
    input{
        all: unset;
        flex: 1;
        padding: 8px 0;
        font-size: 14px;
        font-weight: 400;
    }
    input::placeholder{
        font-size: 14px;
        font-weight: 400;
    }
    .wrapper.error{
        background-color: var(--errorBg);
        color: white;
    }
    .wrapper.error > input::placeholder{ color: var(--errorColor); }
    .icon{
        all: unset;
        display: flex;
        align-items: center;
        justify-content: center;
        fill: var(--iconColor);
    }
    .rounded{
        border-radius: 50px;
    }
</style>