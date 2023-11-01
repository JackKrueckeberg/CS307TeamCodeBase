import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// update the favorite searches list
router.patch("/:email", async (req, res) => {
  let collection = db.collection("users");
  let q = {email: req.params.email};  // Search by email
  let query = collection.findOne(q);
    const updates =  {
      $set: {
        recent_discussion_searches: req.body.recent_discussion_searches
      }
    };
  
    let result = await collection.updateOne(query, updates);
  
    res.send(result).status(200);
});



router.delete("/:email", async (req, res) => {
    const email = req.params.email;
    const collection = db.collection("users");
  
    // Define a query to find the user by email
    const query = { email: email };
  
    // Define an update to clear the recent_searches field
    const update = {
      $set: { recent_discussion_searches: [] },
    };
  
    // Use updateOne to update the user with the specified email
    const result = await collection.updateOne(query, update);
  
    if (result.modifiedCount > 0) {
      res.status(200).send("Recent discussion searches cleared for the user.");
    } else {
      res.status(404).send("User not found.");
    }
  });
  
  
  
  export default router;

