import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// update the favorite searches list
router.patch("/:name", async (req, res) => {
  let collection = await db.collection("cities");
  let q = {email: req.params.email};  // Search by email
  let query = await collection.findOne(q);
    const updates =  {
      $set: {
        favorite_cities: req.body.discussion.comments
      }
    };
  
    let result = await collection.updateOne(query, updates);
  
    res.send(result).status(200);
});

export default router;