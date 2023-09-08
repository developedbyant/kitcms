import fs from "fs"
import { globby } from "globby"

const files = await globby("./src",{expandDirectories:{files: ['*.ts','*.svelte']}})

for(const filePath of files){
    const fileData = fs.readFileSync(filePath).toString()
    if(fileData.includes("klk")){
        console.log(filePath)
        // const newFileData = fileData.replace(/mdbCMS/g,"svelteCMS")
        // // save file
        // fs.writeFileSync(filePath,newFileData)
        // console.log(filePath)
        // console.log(newFileData)
    }
}