<script lang="ts">
    export let text:string
</script>

<div class="question" data-label-tl="" data-label={text}>?</div>

<style lang="scss">
    .question{
        cursor:context-menu;
        font-size: 15px;
        font-weight: 400;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        background-color: rgba(0,0,0,.2);
        padding: 5px;
        border-radius: 50%;
    }
</style>