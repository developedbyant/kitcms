<script lang="ts">
    export let type:"email"|"password"|"input"
    export let placeholder:string = "content..."
    export let value:string = ""
    export let error:boolean = false
    export let rounded:boolean = false
    export let icon:any|undefined = undefined
    // icons
    import EnvelopeAt from "./icons/EnvelopeAt.svelte";
    import ShieldLockIcon from "./icons/ShieldLock.svelte";
    import EyeIcon from "./icons/Eye.svelte";
    import EyeSlashIcon from "./icons/EyeSlash.svelte";
    let input:HTMLInputElement
    let showPassword:boolean = false
    let attributes = { type, placeholder }
    function handleShowPassword(){
        showPassword = !showPassword
        if(showPassword){ attributes.type = "input" }
        else{ attributes.type = "password" }
    }
</script>

<div class="superInput" class:error class:rounded>
    <!-- icon -->
    {#if icon || ["email","password"].includes(type)}
        <div class="icon">
            {#if icon}
                <svelte:component size=15 this={icon} />
            {:else if type==="email"}
                <EnvelopeAt size=15/>
            {:else if type==="password"}
                <ShieldLockIcon size=15/>
            {/if}
        </div>
    {/if}
    <!-- main input -->
    <input class="mainInput" {...attributes} bind:value bind:this={input} required on:keyup>
    <!-- show password button -->
    {#if type==="password"}
        <button class="showPassBtn" on:click={handleShowPassword} on:keypress={handleShowPassword}>
            {#if showPassword}
                <EyeSlashIcon size=15/>
            {:else}
                <EyeIcon size=15/>
            {/if}
        </button>
    {/if}
</div>

<style>
    .superInput{
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
    .superInput:hover, .superInput:focus-within{
        transform: scale(1.01);
        box-shadow: 0 0 2px 2px var(--shadow);
    }
    .mainInput{
        all: unset;
        flex: 1;
        padding: 8px 0;
        font-size: 14px;
        font-weight: 400;
    }
    .mainInput::placeholder{
        font-size: 14px;
        font-weight: 400;
    }
    .superInput.error,.superInput.error::placeholder{
        background-color: var(--errorBg);
        color: var(--errorColor);
    }
    .icon,.showPassBtn{
        all: unset;
        display: flex;
        align-items: center;
        justify-content: center;
        fill: var(--iconColor);
    }
    .showPassBtn{
        cursor: pointer;
        padding: 5px;
        border-radius: 50%;
        background-color: rgba(0,0,0,.1);
    }
    .rounded{
        border-radius: 50px;
    }
</style>