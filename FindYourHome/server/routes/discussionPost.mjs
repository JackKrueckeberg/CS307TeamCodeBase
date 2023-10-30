import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();

//this route gets all the users and their data
router.get("/getDiscussions", async (req, res) => {
    console.log("in get discussions");
    try {
        let collection = await db.collection("discussions");
        let results = await collection.find({}).toArray();
        // Send the results back as JSON with a 200 status code.
        return res.send(results).status(200);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;