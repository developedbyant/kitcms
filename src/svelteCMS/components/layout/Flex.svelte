<script lang="ts">
    export let direction:"column"|"row" = "column"
    export let mobileDirection:"column"|"row" = "column"
    export let gap:string = "10px"
    $: style = `
        flex-direction:${direction};
        gap:${gap};
        --mobileDirection:${mobileDirection}
    `
</script>

<div class="flex" {style}>
    <slot/>
</div>

<style>
    .flex{
        display: flex;
    }
    @media(max-width:700px){
        .flex{
            flex-direction: var(--mobileDirection);
        }
    }
</style>