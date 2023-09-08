<div class="rightContent">
    <slot/>
</div>

<style>
    .rightContent{
        display: flex;
        flex-direction: column;
        gap: 20px;
        border-radius: 5px;
        max-width: 250px;
        width: 100%;
        height: fit-content;
        background-color: var(--blurBg);
        box-shadow: 1px 2px 2px var(--shadow);
        border: 1.5px solid var(--borderColor);
        padding: 10px;
    }
    /* on mobile */
    @media(max-width:700px){
        .rightContent{
            max-width: 100%;
        }
    }
</style>