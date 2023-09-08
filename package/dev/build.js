import fs from "fs-extra"
const CWD = process.cwd()
const paths = {
    cms:{
        packageJson:`${CWD}/package.json`,
        middleware:`${CWD}/svelteCMS.js`,
        coreFilesFolder:`${CWD}/src/svelteCMS`,
        adminRouteFolder:`${CWD}/src/routes/admin`,
    },
    build:{
        packageJson:`${CWD}/package/build/package.json`,
        middleware:`${CWD}/package/build/svelteCMS.js`,
        coreFilesFolder:`${CWD}/package/build/svelteCMS`,
        adminRouteFolder:`${CWD}/package/build/admin`,
    }
}

// delete folders if they exists
if(fs.existsSync(paths.build.packageJson)) fs.removeSync(paths.build.packageJson)
if(fs.existsSync(paths.build.middleware)) fs.removeSync(paths.build.middleware)
if(fs.existsSync(paths.build.middleware)) fs.removeSync(paths.build.middleware)
if(fs.existsSync(paths.build.coreFilesFolder)) fs.removeSync(paths.build.coreFilesFolder)
if(fs.existsSync(paths.build.adminRouteFolder)) fs.removeSync(paths.build.adminRouteFolder)
// copy folders
fs.copySync(paths.cms.packageJson,paths.build.packageJson)
fs.copySync(paths.cms.middleware,paths.build.middleware)
fs.copySync(paths.cms.coreFilesFolder,paths.build.coreFilesFolder)
fs.copySync(paths.cms.adminRouteFolder,paths.build.adminRouteFolder)

// update version
/** @type {{[key:string]:any}} */
const appJson = JSON.parse(fs.readFileSync(`${paths.build.coreFilesFolder}/app.json`).toString())
/** @type {{[key:string]:any}} */
const packageJson = JSON.parse(fs.readFileSync(`${CWD}/package/package.json`).toString())
packageJson['version'] = appJson['version']
// save ./package/package.json
fs.writeFileSync(`${CWD}/package/package.json`,JSON.stringify(packageJson,null,4))