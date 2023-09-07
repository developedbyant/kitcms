<script lang="ts">
    export let margin:string = "0 0 10px 0"
    export let text:string
    export let btn:string|{ text:string,href:string,newTab?:boolean}|undefined = undefined
    export let rounded:boolean = false
    let pressing:boolean = false
    const onPress = ()=> pressing = true
    const onPressUp = ()=> pressing = false
</script>

<div class="label" style="margin: {margin};">
    <span>{text}</span>
    <div class="rightMenu" class:rounded>
        {#if btn && typeof btn === "string"}
            <button class="btn" class:pressing on:pointerup={onPressUp} on:pointerdown={onPress} on:click on:pointerdown>
                {btn}
            </button>
        {:else if typeof btn === "object"}
            <a href={btn.href} class="btn" target={btn.newTab?"_blank":""}>
                {btn.text}
            </a>
        {/if}
        <slot />
    </div>
</div>

<style lang="scss">
    .label{
        position: relative;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }
    span{
        color: var(--textColor);
        font-size: 18px;
        font-weight: 500;
        margin-left: 10px;
        &::before{
            content: "";
            position: absolute;
            left: 0;
            height: 100%;
            width: 4px;
            border-radius: 4px;
            background-color: var(--secondColor);
        }
    }
    .btn{
        cursor: pointer;
        text-decoration: none;
        text-transform: capitalize;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 13px;
        font-weight: 400;
        background-color: var(--buttonBg);
        color: var(--buttonColor);
        fill: var(--buttonColor);
        box-shadow: var(--shadow);
        display: flex;
        align-items: center;
        transition: all ease-in-out 0.1s;
        &:hover{ opacity: 80%; }
    }
    .rightMenu{
        display: flex;
        align-items: center;
        gap: 10px;
    }
    // make border radius rounded
    .rightMenu.rounded > .btn{
        border-radius: 50px;
    }
    // add pressing effect
    .pressing{
        transform: scale(0.95);
    }
</style>