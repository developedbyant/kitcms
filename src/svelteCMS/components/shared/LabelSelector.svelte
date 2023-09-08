<script lang="ts">
    export let margin:string = "0 0 10px 0"
    export let rounded:boolean = false
    export let text:string
    export let options:string[]
    export let value:string;
</script>

<div class="label" style="margin: {margin};">
    <span class="text">{text}</span>
    <select class="btn" class:rounded bind:value>
        {#each options as option}
            <option value={option}>{option}</option>
        {/each}
    </select>
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
    .text{
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
        font-weight: 500;
        background-color: var(--buttonBg);
        color: var(--buttonColor);
        fill: var(--buttonColor);
        box-shadow: var(--shadow);
        display: flex;
        text-align: center;
        align-items: center;
        transition: all ease-in-out 0.1s;
        &:hover{ opacity: 80%; }
        &:focus{ outline: none;}
        // remove default arrow
        appearance:none;
        -webkit-appearance:none;
        -moz-appearance: none;
    }
    // make border radius rounded
    .btn.rounded{
        border-radius: 50px;
    }
</style>