import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();




router.get("/:email", async (req, res) => {
  let collection = await db.collection("users");
  let q = {email: req.params.email};
  let query = await collection.findOne(q);
  res.send(query).status(200);
});


// update the favorite searches list
router.patch("/:email", async (req, res) => {
  let collection = await db.collection("users");
  let q = {email: req.params.email};  // Search by email
  let query = await collection.findOne(q);
    const updates =  {
      $set: {
        bookmarked_discussions: req.body.bookmarked_discussions
      }
    };
  
    let result = await collection.updateOne(query, updates);
  
    res.send(result).status(200);
});

export default router;