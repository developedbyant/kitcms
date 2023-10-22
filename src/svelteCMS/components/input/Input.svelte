<script lang="ts">
    export let type:"email"|"password"|"input"|"number"|"date"|string
    export let placeholder:string = `${type}...`
    export let value:string
    export let error:boolean = false
    export let rounded:boolean = false
    export let icon:any = undefined
    import EyeIcon from "./icons/Eye.svelte";
    import EyeSlashIcon from "./icons/EyeSlash.svelte";
    let showPass:boolean = false
    /** show or hide password input */
    const showPassword = ()=> { showPass = !showPass ; type = showPass ? "password" : "text" }

    /** handle input changes */
    const handleInput = (e:any)=>{
        value = type==="number" ? e.target.valueAsNumber : type==="date" ? e.target.valueAsDate : e.target.value
    }
</script>

<div class="container" class:error class:rounded>
    {#if type!=="password" && icon}
        <div class="icon">
            <svelte:component this={icon} />
        </div>
    {/if}
    {#if type==="password"}
        <button on:click={showPassword}>
            {#if showPass}<EyeSlashIcon size=15/>{:else}<EyeIcon size=15/>{/if}
        </button>
    {/if}
    <input {value} type={type==="string"?"text":type} {placeholder} on:input={handleInput} on:keyup>
</div>

<style lang="scss">
    .container{
        display: flex;
        align-items: center;
        gap: 5px;
        background-color: var(--antiAppBg);
        padding: 5px 10px;
        border-radius: 3px;
    }
    .container.rounded{ border-radius: 50px; }
    .icon{
        display: flex;
        align-items: center;
        justify-content: center;
        fill: var(--iconColor);
    }
    input{
        width: 100%;
        font-size: 14px;
        font-weight: 400;
        color: var(--textColor);
        border: none;
        background-color: transparent;
        &::placeholder{
            font-size: 14px;
            font-weight: 400;
        }
        &:focus{ outline: none; }
    }
    .container.error >  input, .container.error > input::placeholder{
        background-color: var(--errorBg);
        color: var(--errorColor);
    }
    button{
        all: unset;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        fill: var(--iconColor);
        padding: 5px;
        border-radius: 50%;
        background-color: rgba(0,0,0,.1);
    }
</style>