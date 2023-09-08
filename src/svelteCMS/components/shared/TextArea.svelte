<script lang="ts">
    export let placeholder:string = "content..."
    export let value:string = ""
    export let error:boolean = false
    export let rounded:boolean = false
</script>

<textarea bind:value={value} {placeholder} class:error class:rounded on:mouseleave on:mouseenter/>

<style lang="scss">
    textarea{
        min-height: 100px;
        resize: vertical;
        padding: 10px;
        width: 100%;
        height: fit-content;
        border: none;
        font-weight: 400;
        border-radius: 5px;
        background-color: var(--antiAppBg);
        color: var(--textColor);
        transition: background-color 0.3s;
        box-shadow: var(--shadow);
        &:focus{ outline: none; }
    }
    textarea::-webkit-outer-spin-button,
    textarea::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    textarea.error{
        background-color: var(--errorBg);
    }
    textarea.error::placeholder{ color: var(--errorColor); }
</style> 