import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Profile Route

// Get user info
router.get("/:id", async (req, res) => {
    try {
        let collection = await db.collection("users");
        let query = {_id: new ObjectId(req.params.id)};  // Search for the user by id
        let result = await collection.findOne(query);
    
        if (!result) return res.status(404).send("User Not found");
        else return res.status(200).send(result);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
});

// Update the user info
router.patch("/:id", async (req, res) => {
    const query = {_id: new ObjectId(req.params.id)}; // update the user based on their id
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
  
    let collection = await db.collection("users");
    let result = await collection.updateOne(query, updates);

    res.send(result).status(200);
});

export default router;