// @ts-check
import fs from "fs-extra"
const CWD = process.cwd()
const paths = {
    cms:{
        coreFilesFolder:`${CWD}/src/mdbCMS`,
        adminRouteFolder:`${CWD}/src/routes/admin`,
    },
    build:{
        coreFilesFolder:`${CWD}/package/build/mdbCMS`,
        adminRouteFolder:`${CWD}/package/build/admin`,
    }
}

// copy core files
if(fs.existsSync(paths.build.coreFilesFolder)) fs.removeSync(paths.build.coreFilesFolder)
if(fs.existsSync(paths.build.adminRouteFolder)) fs.removeSync(paths.build.adminRouteFolder)
fs.copySync(paths.cms.coreFilesFolder,paths.build.coreFilesFolder)
// copy admin folder
// console.log(paths)
// console.log(paths.adminRoute)