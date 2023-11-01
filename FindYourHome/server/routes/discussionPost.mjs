import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();

// Endpoint to retrieve all discussions
router.get("/getDiscussions", async (req, res) => {
    try {
        let collection = await db.collection("discussions");

        const discussions = await collection.find({}).toArray();

        return res.status(200).json(discussions);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
