<script lang="ts">
    export let currentValue:string
    export let item:string
    $:active = currentValue === item
</script>

<button class="link" class:active on:click={()=>currentValue=item}>
    {item}
</button>

<style lang="scss">
    .link {
        text-decoration: none;
        border: none;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px 10px;
        border-radius: 50px;
        box-shadow: 1px 2px 3px var(--shadow);
        background-color: transparent;
        color: var(--buttonColor);
        font-size: 14px;
        font-weight: 600;
        transition: all ease 0.3s;
        text-transform: capitalize;
        &:hover,&.active {
            cursor: pointer;
            background-color: var(--buttonBg);
        }
    }
</style>