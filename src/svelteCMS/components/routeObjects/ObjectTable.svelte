<script lang="ts">
    export let object:ObjectData
    import type { ObjectData } from "svelteCMS/types";
    import { fade } from "svelte/transition";
    import JsonIcon from "svelteCMS/icons/Json.svelte";
    import EyeSlashIcon from "svelteCMS/icons/EyeSlash.svelte"
</script>

<div class="table" in:fade>
    {#each Object.entries(object) as [objectKey,objectValue]}
        {@const valueType = typeof objectValue}
        {#if !objectKey.startsWith("_")}
            <div class="row">
                <span class="rowName">{objectKey}</span>
                <span class="rowValue">
                    {#if objectKey.includes("password")}
                        <EyeSlashIcon />
                    {:else if valueType==="object"}
                        <JsonIcon />
                    {:else if valueType==="string"}
                        {objectValue.substring(0,70)}
                        {#if objectValue.length>=70}...{/if}
                    {:else}
                        {objectValue}
                    {/if}
                </span>
            </div>
        {/if}
    {/each}
</div>

<style>
    .table{
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .row{
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: var(--cardBg);
        border: 1.5px solid var(--borderColor);
        padding: 5px 10px;
        border-radius: 50px;
    }
    .rowName{
        font-size: 15px;
        font-weight: 600;
        color: var(--textColor);
        margin-right: 10px;
    }
    .rowValue{
        font-size: 15px;
        font-weight: 300;
        color: var(--textColor);
        fill: var(--textColor);
    }
    /* Mobile */
    @media(max-width:700px){
        .rowName{
            font-weight: 600;
        }
        .rowName,.rowValue{
            font-size: 17px;
        }
        .rowValue{
            /* Fix overflow on mobile */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 120px;
        }
    }
</style>