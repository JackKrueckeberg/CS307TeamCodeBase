import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();

// update the favorite searches list
router.patch("/:email", async (req, res) => {
  let collection = await db.collection("users");
  let q = {email: req.params.email};  // Search by email
  let query = await collection.findOne(q);
    const updates =  {
      $set: {
        favorite_discussions: req.body.favorite_discussions
      }
    };
  
    let result = await collection.updateOne(query, updates);
  
    res.send(result).status(200);
});

export default router;