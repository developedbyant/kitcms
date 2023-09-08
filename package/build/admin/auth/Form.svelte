<script lang="ts">
    export let link:{ text:string,href:string,hrefText:string }|undefined = undefined
    // { text:"Don't have an account?",hrefText:"Sign up",href:"/admin/auth/register"}
    import PersonIcon from "svelteCMS/icons/Person.svelte"
</script>

<div class="person">
    <slot name="icon">
        <PersonIcon size=60/>
    </slot>
</div>
<div class="form">
    <slot name="formData"/>
    {#if link}
        <span class="link">
            {link.text}
            <a href={link.href}>{link.hrefText}</a>
        </span>
    {/if}
</div>


<style lang="scss">
    .person{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background-color: rgba(0,0,0,5%);
        fill: var(--iconColor);
        border-radius: 50%;
        box-shadow: 0 2px 2px 2px rgba(0,0,0,.1);
    }
    .form{
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 350px;
        width: 95%;
    }
    .link{
        display: flex;
        align-items: center;
        gap: 5px;
        color: var(--textColor);
        font-size: 14px;
        font-weight: 400;
        a{
            text-decoration: none;
            font-size: 15px;
            font-weight: 600;
            color: var(--mainColor);
        }
    }
</style>