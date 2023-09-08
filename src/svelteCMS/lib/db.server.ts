import { MongoClient } from "mongodb"
import { DATABASE_URL,DATABASE_NAME } from "$env/static/private"
const mongoClient = new MongoClient(DATABASE_URL)
await mongoClient.connect()
export default mongoClient.db(DATABASE_NAME)