<div class="content">
    <slot/>
</div>

<style lang="scss">
    .content{
        display: flex;
        flex-direction: row;
        gap: 30px;
    }
    @media(max-width:700px){
        .content{
            flex-direction: column;
        }
    }
</style>