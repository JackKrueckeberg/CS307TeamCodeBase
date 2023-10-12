import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Profile Route

// Get user info
router.get("/:id", async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };

    let collection = await db.collection("user_info");
    let user = await collection.findOne(query);

    if (user) {
        // User found, send user information as a response
        res.status(200).json(user);
    } else {
        // User not found
        res.status(404).json({ message: "User not found" });
    }
});

// Update the user info
router.patch("/:id", async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };
    const updates =  {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        bio: req.body.bio,
        image: req.body.image,
      }
    };
  
    let collection = await db.collection("user_info");
    let result = await collection.updateOne(query, updates);

    res.send(result).status(200);
});

export default router;