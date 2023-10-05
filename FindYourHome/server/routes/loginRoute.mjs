import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
    try {
        let collection = await db.collection("users");  // Assuming you have a "users" collection
        
        // Find user by email
        let user = await collection.findOne({ email: req.body.email });
        
        // If no user found or password doesn't match
        if (!user || user.password !== req.body.password) {
            return res.status(400).json({ error: "Invalid Email or Password" });
        }

        // If credentials are correct
        return res.status(200).json({ message: "Logged in successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Export the router
export default router;