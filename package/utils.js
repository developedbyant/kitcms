import bcrypt from "bcrypt"
import { MongoClient } from "mongodb"

export default new class Utils {

    /** hash string @param {string} data - string data */
    passwordHash(data){ return bcrypt.hashSync(data,10) }

    /** Test mongodb connection @param {string} connectionUrl - @param {string} dbName */
    async mongodb(connectionUrl,dbName){
        try{
            const client = new MongoClient(connectionUrl)
            await client.connect()
            const db = client.db(dbName)
            return { db,client }
        }
        catch(e){ return { error:e.message } }
    }
    /** log message with colors */
    log = new class {
        normal(data) {console.log(`\x1B[34m${data}\x1b[0m`)}
        error(data) {console.log(`\x1b[31m${data}\x1b[0m`)}
        ok(data) {console.log(`\x1b[32m${data}\x1b[0m`)}
    }
}