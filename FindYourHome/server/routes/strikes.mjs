import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();


router.get("/:username", async (req, res) => {
  try {
    let collection = await db.collection("users");
    let query = { username: req.params.username };  // Search by email
    let result = await collection.findOne(query);

    if (!result) return res.status(404).send("Not found");
    else return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.patch("/:username", async (req, res) => {
  let collection = await db.collection("users");
  let q = {username: req.params.username};  // Search by email
  let query = await collection.findOne(q);
    const updates =  {
      $set: {
        strikes: req.body.strikes
      }
    };
  
    let result = await collection.updateOne(query, updates);
  
    res.send(result).status(200);
});

export default router;