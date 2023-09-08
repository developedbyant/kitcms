import bcrypt from "bcrypt"
import { addDays } from "date-fns"
import { ObjectId } from "mongodb"
import type { RequestEvent } from "@sveltejs/kit"
import type { AppCollectionNames,UserData,UserLoad,UserSessionData,UserSessionLoad } from "svelteCMS/types"
import type { Db as MongoDB,Collection as MongoCol } from "mongodb"

export default class Auth {
    private usersCol:MongoCol
    private sessionsCol:MongoCol

    constructor(db:MongoDB){
        const usersColName = "_Users"
        const sessionsColName:AppCollectionNames = "_Sessions"
        this.usersCol = db.collection(usersColName)
        this.sessionsCol = db.collection(sessionsColName)
    }

    /** Try to login user */
    async login(event:RequestEvent,data:{ email:string,password:string }){
        const userData = await this.usersCol.findOne({ email:data.email })
        // if user do not exists stop function
        if(!userData) return false
        // else check user password
        const correctPassword = bcrypt.compareSync(data.password,userData.password)
        // if password is incorrect
        if(!correctPassword) return false
        // finally create user session/login
        const userID = userData._id.toString()
        const sessionData:UserSessionData = await this.sessionCreate(userID,event)
        return{ session:sessionData }
    }

    /** Try to log user out */
    async logout(event:RequestEvent){
        const sessionID = event.cookies.get("sessionID") || ""
        this.cookieDelete(event,sessionID)
        await this.sessionDelete(sessionID)
    }

    /** Try to register new user */
    async register(event:RequestEvent,newUserData:UserLoad,createSession:boolean=true){
        const userDataDB = await this.usersCol.findOne({ email:newUserData.email })
        // if user exists stop function
        if(userDataDB) return false
        // hash password and insert user and create new session
        newUserData['password'] = await bcrypt.hash(newUserData.password,10)
        const insertedUser = await this.usersCol.insertOne(newUserData)
        const userID = insertedUser.insertedId.toString()
        const userData:UserData = { _id:insertedUser.insertedId,...newUserData }
        if(createSession){
            const sessionData:UserSessionData = await this.sessionCreate(userID,event)
            return{ session:sessionData,userData } 
        }else return{ userData }
    }

    /** Validate session */
    async sessionValidate(event:RequestEvent){
        const sessionID = event.cookies.get("sessionID")
        // if session id not founded in cookies stop function
        if(!sessionID) return false
        // check if session exists
        const sessionData = await this.sessionsCol.findOne({ _id:new ObjectId(sessionID) }) as UserSessionData | null
        // stop if session not founded and remove it from cookies
        if(!sessionData){
            this.cookieDelete(event,"sessionID")
            return false
        }
        // check for ip and browser
        const userAgent = event.request.headers.get("user-agent") as string
        const userIp = event.getClientAddress()        
        const otherSecurityPassed = ( userAgent===sessionData.browser && userIp==sessionData.ip )
        // if sessionID ip or user agent are not the same as the ones from current request
        // Remove cookie,delete session from sessions col and stop function
        if(!otherSecurityPassed){
            await this.sessionDelete(sessionID)
            this.cookieDelete(event,"sessionID")
            return false
        }
        // return user after validated
        const userData = await this.usersCol.findOne({ _id:new ObjectId(sessionData.userID) }) as UserData
        const _id = userData._id.toString()
        // convert ObjectId to string to avoid svelteKit json parser error
        const cleanUserData = {...userData,_id }
        return{ userData:cleanUserData }
    }

    /** Delete session */
    async sessionDelete(sessionID:string){
        // check if the session exists, make sure to convert sessionID to ObjectId
        const sessionData = await this.sessionsCol.findOne({ _id:new ObjectId(sessionID)})
        // only try to delete if session actually exist
        if(sessionData) await this.sessionsCol.deleteOne({ _id:new ObjectId(sessionID)})
    }

    /** Create new session */
    async sessionCreate(userID:string,event:RequestEvent){
        const newSession:UserSessionLoad = {
            userID: userID,
            createdAt: new Date(),
            expireAt: addDays(new Date(),7),
            ip: event.getClientAddress(),
            browser: event.request.headers.get("user-agent") as string
        }
        const insertedSession = await this.sessionsCol.insertOne(newSession)
        const sessionID = insertedSession.insertedId.toString()
        // set cookie
        this.cookieSet(event,"sessionID",sessionID)
        return{ _id:sessionID, ...newSession}
    }

    /** Set cookie session */
    cookieSet(event:RequestEvent,cookieName:string,cookieValue:string){
        event.cookies.set(cookieName,cookieValue,{
            path:"/",
            httpOnly:true,
            sameSite:"strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 26 * 30
        })
    }

    /** Remove cookie */
    cookieDelete(event:RequestEvent,cookieName:string){
        event.cookies.set(cookieName,"",{
            path:"/",
            expires: new Date(0)
        })
    }
}
