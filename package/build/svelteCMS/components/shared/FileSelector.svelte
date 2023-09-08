<script lang="ts">
    export let open = false
    import { createEventDispatcher } from "svelte";
    import { createToast } from "svelteCMS/components/toasts/store";
    import utils from "svelteCMS/lib/utils";
    import Modal from "svelteCMS/components/shared/Modal.svelte";
    import Label from "./Label.svelte";
    import Button from "./Button.svelte";
    import Input from "./Input.svelte";
    // icons
    import CloudIcon from "svelteCMS/icons/Cloud.svelte";
    import type { ApiAssetSearch, ApiAssetUpload, ApiAssetUploadUrl, AssetData } from "svelteCMS/types";
    let fileSource:"local"|"url"|"search" = "search"
    let assetName:string = ""
    let uploading:boolean = false
    let tempFile:{ type:string,url:string} = { type:"image",url:"" }
    let fileInput:FileList
    let fileInputUrl:string = ""
    let searchValue:string = ""
    let searchResult:AssetData[] = []
    $: showFileInfo = ( fileSource==="local" && (fileInput && fileInput.length > 0) ) || ( fileSource==="url" && fileInputUrl.trim()!=="" ) && tempFile.url!==""
    const dispatch = createEventDispatcher()

    /** Reset all stages to default */
    function resetAll(){
        assetName = ""
        tempFile.url = ""
        searchValue = ""
        searchResult = []
        // @ts-ignore
        fileInput = undefined
    }

    /** Set file source */
    const setFileSource = (newFileSource:"local"|"url"|"search")=> {
        fileSource = newFileSource
        resetAll()
    }

    /** Set asset name when file input changes */
    const handleChange = async()=> {
        // asset from url
        if(fileSource==="url" && fileInputUrl!==""){
            tempFile.url = fileInputUrl
        }
        // if local asset
        if(fileSource==="local"){
            assetName = fileInput && fileInput.length>0 ? fileInput[0].name : ""
            tempFile.url = URL.createObjectURL(fileInput[0])
        }
    }

    /** Upload file */
    async function uploadFile() {
        uploading = true
        // check for local file input
        if(fileSource==="local" && (!fileInput || assetName==="" || (fileInput && fileInput.length === 0))){
            createToast({ type:"error",msg:"Please select file from local disk"})
        }
        // check for file url input
        else if(fileSource==="url" && (fileInputUrl==="" || assetName.trim()==="")){
            createToast({ type:"error",msg:"Please enter asset url and asset's name"})
        }
        // send request to upload form file
        else if(fileSource==="local"){
            const formData = new FormData()
            formData.append("file",fileInput[0])
            formData.append("assetName",assetName)
            const apiLoad:ApiAssetUpload['input'] = formData
            const apiResponse:ApiAssetUpload['output'] = await utils.apiRequest("/admin/api/assets/upload",apiLoad)
            // show response message
            createToast({ type:apiResponse.error ? "error" : "successful",msg:apiResponse.message})
            // if there was no error, reset all stage and send selected event
            if(!apiResponse.error){
                resetAll()
                dispatch("selected",apiResponse.data)
                dispatch("upload",apiResponse.data)
                open = false
            }
        }
        // send request to upload file from url
        else if(fileSource==="url"){
            const apiLoad:ApiAssetUploadUrl['input'] = { url:fileInputUrl,assetName }
            const apiResponse:ApiAssetUploadUrl['output'] = await utils.apiRequest("/admin/api/assets/upload-url",apiLoad)
            // show response message
            createToast({ type:apiResponse.error ? "error" : "successful",msg:apiResponse.message})
            // if there was no error, reset all stage and send selected event
            if(!apiResponse.error){
                resetAll()
                dispatch("selected",apiResponse.data)
                dispatch("upload",apiResponse.data)
                open = false
            }
        }
        // wait 1 second
        await utils.wait(1000)
        uploading = false
    }

    /** search assets */
    async function searchAssets(e:KeyboardEvent) {
        if(searchValue.trim()!==""){
            const apiLoad:ApiAssetSearch['input'] = { query:searchValue.trim(), limit:5 }
            const apiResponse:ApiAssetSearch['output'] = await utils.apiRequest("/admin/api/assets/search",apiLoad)
            if(!apiResponse.error){
                searchResult = [...apiResponse.data]
            }
        }
    }


    /** Send selected event when click asset */
    function handleAssetSelected(asset:AssetData){
        resetAll()
        dispatch("selected",asset)
        open = false
    }
</script>

<Modal bind:open>
    <div class="selector">
        <Label text="File selector" btn="close" on:click={()=>open=false}/>
        <div class="buttons">
            <button class="btn" class:active={fileSource==="search"} on:click={()=>setFileSource("search")}>🔍 Search</button>
            <button class="btn" class:active={fileSource==="local"} on:click={()=>setFileSource("local")}>📁 Local</button>
            <button class="btn" class:active={fileSource==="url"} on:click={()=>setFileSource("url")}>🌎 Url</button>
        </div>
        <div class="inputWrap">
            {#if fileSource==="url"}
                <input bind:value={fileInputUrl} class="inputUrl" type="url" required placeholder="File link..." on:keyup={handleChange}>
            {:else if fileSource==="search"}
                <input bind:value={searchValue} class="inputSearch" type="search" required placeholder="Search asset..." on:keyup={searchAssets}>
            {:else}
                <label class="uploadBtn" for="file">
                    <CloudIcon size=30/>
                    Upload
                    <input bind:files={fileInput} class="inputFile" type="file" id="file" accept="image/*" on:change={handleChange}>
                </label>
            {/if}
        </div>
        <!-- show file preview -->
        {#if tempFile.url}
            <div class="preview">
                {#if tempFile.type==="image"}
                    <img src={tempFile.url} alt={tempFile.type}>
                {:else if tempFile.type==="video"}
                    <video src={tempFile.url}>
                        <track kind="captions"/>
                    </video>
                {/if}
            </div>
        {/if}
        <!-- Show file info editor -->
        {#if showFileInfo}
            <div class="assetInfo">
                <Input bind:value={assetName} placeholder="Asset name..."/>
                <Button text="Upload" on:click={uploadFile} bind:loading={uploading}/>
            </div>
        {/if}
        <!-- show assets -->
        {#if searchResult.length>0 && fileSource==="search" && searchValue.trim()!==""}
            <div class="assets">
                {#each searchResult as asset}
                    <div class="asset" on:click={()=>handleAssetSelected(asset)} role="none">
                        <img src={asset.src} alt={asset.title}>
                        <span class="assetTitle">{asset.title}</span>
                    </div>
                {/each}
            </div>
            
        {/if}
    </div>
</Modal>

<style lang="scss">
    .selector{
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color: var(--appBg);
        color: var(--textColor);
        padding: 10px;
        border-radius: 10px;
        border: 1.5px solid var(--borderColor);
    }
    .buttons{
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        background-color: rgba(0,0,0,.1);
        border: 1.5px solid var(--borderColor);
        padding: 5px;
        border-radius: 5px;
    }
    .btn{
        border: none;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 10px;
        border-radius: 5px;
        box-shadow: 1px 2px 3px var(--shadow);
        background-color: transparent;
        color: var(--buttonColor);
        font-size: 14px;
        font-weight: 600;
        transition: all ease 0.3s;
        &:hover{
            cursor: pointer;
            background-color: var(--buttonBg);
        }
    }
    .btn.active{
        background-color: var(--buttonBg);
    }
    .uploadBtn{
        cursor: pointer;
        background-color: rgba(0,0,0,.2);
        color: var(--buttonColor);
        fill: var(--buttonColor);
        padding: 15px 20px;
        border-radius: 5px;
        border: 1.5px solid var(--borderColor);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        font-size: 20px;
        font-weight: 800;
    }
    .inputFile {
        display:none;
    }
    .inputUrl,.inputSearch{
        width: 100%;
        background-color: transparent;
        border: 1.5px solid var(--borderColor);
        padding: 15px 20px;
        border-radius: 5px;
        background-color: var(--antiAppBg);
        font-size: 15px;
        font-weight: 400;
        transition: border ease-in-out 0.3s;
        color: var(--textColor);
        &:focus{
            outline: none;
            border: 1.5px dashed var(--mainColor);
        }
    }
    .preview{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 300px;
        overflow: hidden;
        border-radius: 5px;
        border: 1px solid var(--borderColor);
        background-color: var(--antiAppBg);
        img{
            object-fit: cover;
            object-position: center;
            max-height: 100%;
            width: auto;
            height: 100%;
        }
    }
    .assetInfo{
        padding: 10px;
        background-color: rgba(0,0,0,.1);
        border: 1.5px solid var(--borderColor);
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .assets{
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    .asset{
        cursor: pointer;
        width: calc(100% / 3 - 7px);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        background-color: var(--antiAppBg);
        border-radius: 5px;
        box-shadow: 1px 2px 3px var(--shadow);
        position: relative;
        overflow: hidden;
        img{
            object-fit: cover;
            object-position: center;
            width: 100%;
            height: 100%;
        }
    }
    .assetTitle{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        background-color: var(--blurBg);
        backdrop-filter: blur(5px);
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 3px;
    }
</style>