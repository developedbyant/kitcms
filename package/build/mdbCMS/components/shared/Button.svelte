<script lang="ts">
    /** background and color */
    export let config:{ bg:string,color:string} = { bg:"var(--buttonBg)",color:"var(--buttonColor)"}
    export let iconSize:number = 15
    export let text:string
    export let loading:boolean = false
    export let disabled:boolean = false
    export let rounded:boolean = false
    export let full:boolean = true
    export let icon:any = undefined
    import Spinner from "./Spinner.svelte";
    let pressing:boolean = false
    const onPress = ()=> pressing = true
    const onPressUp = ()=> pressing = false
    $: style = `background-color:${config.bg};color:${config.color}`
</script>

<button {style} on:pointerup={onPressUp} on:pointerdown={onPress} on:click class:loading={loading} class:disabled disabled={loading||disabled} class:rounded class:full class:pressing>
    {#if loading}<Spinner />{/if}
    {#if icon && !loading}
        <div class="icon">
            <svelte:component this={icon} size={iconSize}/>
        </div>
    {/if}
    {text}
</button>

<style lang="scss">
    button{
        width: fit-content;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 5px;
        padding: 8px 18px;
        font-size: 13px;
        font-weight: 600;
        box-shadow: var(--shadow);
        text-transform: uppercase;
        // Hover
        transition: all ease-in-out 0.1s;
        &:hover{ opacity: 80%; }
    }
    .icon{
        display: flex;
        align-items: center;
        justify-content: center;
        fill: var(--buttonColor);
        margin-right: 3px;
        border-radius: 50%;
    }
    // When loading
    button.loading,.disabled{
        cursor: not-allowed;
        opacity: 80%;
    }
    // make border radius rounded
    .rounded{
        border-radius: 50px;
    }
    // make button full width
    .full{
        width: 100%;
    }
    // add pressing effect
    .pressing{
        transform: scale(0.98);
    }
</style>