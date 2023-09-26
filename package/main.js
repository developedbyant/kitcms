#! /usr/bin/env node
import fs from "fs-extra"
import path from "path"
import inquirer from "inquirer"
import utils from "./utils.js"
import defaults from "./defaults.js"
const CWD = process.cwd()
const config = { dbUrl:"",dbName:"",rootEmail:"",rootPassword:"" }
const paths = {
    build:`${path.dirname(new URL(import.meta.url).pathname)}/build`,
    project:`${CWD}/src`,
    // project:`${CWD}/test/src`,
}

/** handle project layout */
function handleLayout(){
    const projectLayoutPath = `${paths.project}/routes/+layout.svelte`
    const projectLayoutExists = fs.existsSync(projectLayoutPath)
    // if project layout file does not exists, create one
    if(!projectLayoutExists){
        fs.writeFileSync(projectLayoutPath,defaults.layout)
        fs.writeFileSync(`${paths.project}/routes/ProjectLayout.svelte`,"<slot />")
        utils.log.normal("added src/routes/+layout.svelte")
        utils.log.normal("added src/routes/ProjectLayout.svelte where you can add you project layout")
    }else{
        fs.writeFileSync(projectLayoutPath,defaults.layout)
        fs.writeFileSync(`${paths.project}/routes/ProjectLayout.svelte`,fs.readFileSync(projectLayoutPath).toString())
        utils.log.normal("added src/routes/+layout.svelte")
        utils.log.normal("added src/routes/ProjectLayout.svelte where you can add you project layout")
    }
}

/** Handle project hooks */
function handleHooks(){
    const projectHooksPath = `${paths.project}/hooks.server.ts`
    const projectHooksExists = fs.existsSync(projectHooksPath)
    // if project hooks file does not exists, copy cms hooks file to src/hooks.server.ts
    if(!projectHooksExists){
        fs.writeFileSync(projectHooksPath,defaults.hooksFileCms)
        utils.log.normal("created src/hooks.server.ts")
    }
    // else if cms hooks not in hooks file make new file for project hooks and import that file hooks to src/hooks.server.ts together with cms hooks
    else if(!fs.readFileSync(projectHooksPath).toString().includes("svelteCMSHooks")){
        const projectHooksData = fs.readFileSync(projectHooksPath).toString()
        const appHooksPath = `${paths.project}/projectHooks.server.ts`
        // create hooks files
        fs.writeFileSync(appHooksPath,projectHooksData)
        fs.writeFileSync(projectHooksPath,defaults.hooksFile)
        utils.log.normal("updated src/hooks.server.ts")
        utils.log.normal("created src/projectHooks.server.ts where you can add you project hooks")
    }
}

/** Handle project dependencies */
async function handleDependencies(){
    /** Project package.json data @type {{[key:string]:any}} */
    const projectPackageJson = JSON.parse(fs.readFileSync(`${CWD}/package.json`).toString())
    /** Build package.json data @type {{[key:string]:any}} */
    const packageJson = JSON.parse(fs.readFileSync(`${paths.build}/package.json`).toString())
    // check if dependencies are empty, is yes set them to {}
    if(!projectPackageJson.dependencies) projectPackageJson['dependencies'] = {}
    if(!projectPackageJson.devDependencies) projectPackageJson['devDependencies'] = {}
    // dependencies
    for(const [dependency,version] of Object.entries(packageJson.dependencies)){
        const depExists = dependency in projectPackageJson.dependencies
        if(!depExists && !packageJson.excludeDependencies.includes(dependency)) projectPackageJson.dependencies[dependency] = version
    }
    // devDependencies
    for(const [dependency,version] of Object.entries(packageJson.devDependencies)){
        const depExists = dependency in projectPackageJson.devDependencies
        if(!depExists && !packageJson.excludeDependencies.includes(dependency)) projectPackageJson.devDependencies[dependency] = version
    }
    // save changes
    fs.writeFileSync(`${CWD}/package.json`,JSON.stringify(projectPackageJson,null,4))
}

const updating = fs.existsSync(`${paths.project}/svelteCMS`) && fs.existsSync(`${paths.project}/svelteCMS/app.json`) && fs.existsSync(`${paths.project}/routes/admin`)

// confirm folder deletion from project
const folderDelConfirm = (await inquirer.prompt({ type:"confirm",message:"The following folders will be overwritten or created\n   src/svelteCMS\n    svelteCMS.js\n   src/routes/admin want to continue ?",name:"data"})).data

// fresh installation
if(folderDelConfirm && !updating){
    // ask for mongodb information
    const dbUrl = (await inquirer.prompt({ type:"input",message:"Please provide mongodb connection url:",name:"data",default:"mongodb://localhost:27017/"})).data
    const dbName = (await inquirer.prompt({ type:"input",message:"Please provide mongodb database name:",name:"data"})).data

    // show thank u message
    config['dbUrl'] = dbUrl
    config['dbName'] = dbName

    // confirm mongodb connection, if connection fail stop script
    const mongodb = await utils.mongodb(config.dbUrl,config.dbName)
    if("error" in mongodb){
        utils.log.error(`Could not connect to mongodb connection :(\n    url:${config.dbUrl}\n    dbName:${config.dbName}\n    error:${mongodb.error}`)
        process.exit(1)
    }

    // ask to reset database
    const dbExists = (await mongodb.db.admin().listDatabases()).databases.find(data=>data.name===config.dbName)
    if(dbExists){
        const resetDatabase = (await inquirer.prompt({ type:"confirm",message:`Looks like ${config.dbName} already exists, it may conflict with CMS would you like to reset it ?`,name:"data"})).data
        if(resetDatabase) await mongodb.db.dropDatabase()
        utils.log.ok(`Database:${config.dbName} was reset`)
    }

    // create default user
    const rootEmail = (await inquirer.prompt({ type:"input",message:"Please provide the root email for cms",name:"data",default:defaults.user.email})).data
    const rootPassword = (await inquirer.prompt({ type:"input",message:"Please provide the root password for cms",name:"data",default:defaults.user.password})).data
    config['rootEmail'] = rootEmail
    config['rootPassword'] = utils.passwordHash(rootPassword)
    const userData = defaults.user
    userData['password'] = config.rootPassword
    // @ts-ignore
    userData['createdAt'] = new Date()
    const insertedRes = await mongodb.db.collection("_Users").insertOne(userData)
    // show message
    utils.log.ok(`User ${config.rootEmail} was created :)`)

    // copy files
    fs.copySync(`${paths.build}/svelteCMS`,`${paths.project}/svelteCMS`)
    fs.copySync(`${paths.build}/admin`,`${paths.project}/routes/admin`)
    fs.copySync(`${paths.build}/svelteCMS.js`,`${CWD}/svelteCMS.js`)
    // show message
    utils.log.ok(`The following files were copied to your project\n    src/svelteCMS\n    src/routes/admin\n    ./svelteCMS.js`)    

    // handle dependencies
    handleDependencies()
    // handle hooks
    handleHooks()
    // handle layout
    handleLayout()

    // add data to .env file or create if not there
    if(!fs.existsSync(`${CWD}/.env`)) fs.writeFileSync(`${CWD}/.env`,`DATABASE_URL="${config.dbUrl}"\nDATABASE_NAME="${config.dbName}"`)
    else fs.appendFileSync(`${CWD}/.env`,`DATABASE_URL="${config.dbUrl}"\nDATABASE_NAME="${config.dbName}"`)

    // close mongodb connection to end script
    utils.log.ok(`Installation completed`)
    utils.log.normal(`Here is what to do next\n  add { svelteCMS:"src/svelteCMS/*" } to ./svelte.config.js config>kit>alias\n  add { svelteCMS:import("svelteCMS/types/locals").Locals } to app.d.ts > global>App>Locals\n  add { svelteCMS:import("svelteCMS/types/locals").PageData } to app.d.ts > global>App>PageData\n  run: npm install`)
    await mongodb.client.close()
    process.exit(0)
}

// update cms
else if(folderDelConfirm && updating){
    // make a copy of database.server.ts if exists
    const projectFetcherPath = `${paths.project}/svelteCMS/lib/database.server.ts`
    const tempProjectFetcherPath = `${paths.project}/fetcher.ts`
    if(fs.existsSync(projectFetcherPath)) fs.copyFileSync(projectFetcherPath,tempProjectFetcherPath)
    // copy files
    fs.copySync(`${paths.build}/svelteCMS`,`${paths.project}/svelteCMS`)
    fs.copySync(`${paths.build}/admin`,`${paths.project}/routes/admin`)
    // make a copy temp database.server.ts to the correct path and delete temp file
    if(fs.existsSync(tempProjectFetcherPath)){
        fs.copyFileSync(tempProjectFetcherPath,projectFetcherPath)
        fs.removeSync(tempProjectFetcherPath)
    }

    // show message
    utils.log.ok(`The following files were copied to your project\n    src/svelteCMS\n    src/routes/admin`)    

    // handle dependencies
    handleDependencies()

    // end script
    utils.log.ok(`Update completed, run the following command > npm install`)
    process.exit(0)
}