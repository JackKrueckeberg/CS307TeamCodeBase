import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";

const client = new MongoClient(connectionString);

console.log("starting to connect to db")

let conn;
try {
  conn = await client.connect();
  console.log("connected!")
} catch(e) {
  console.error(e);
}

let db = conn.db("sample_training");

export default db;