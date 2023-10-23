import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();

// Endpoint to add a new discussion
router.post("/newDiscussion", async (req, res) => {
    try {
        let collection = await db.collection("discussions");

        const { title, content, city, selectorChoice, dropdownSelection } = req.body;

        const newDiscussion = {
            title: title,
            city: city,
            content: content,
            authorType: selectorChoice, 
            category: dropdownSelection,
            date: new Date(),
        };

        const result = await collection.insertOne(newDiscussion);

        if (result) {
            return res.status(200).json({ 
                message: "Discussion added successfully",
                discussion: newDiscussion
            });
        } else {
            throw new Error("Failed to insert discussion");
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

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
