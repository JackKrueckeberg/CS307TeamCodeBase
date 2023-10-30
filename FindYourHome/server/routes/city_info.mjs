import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  let collection = await db.collection("cities_full_2");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});




router.get("/:name", async (req, res) => {
  let collection = await db.collection("cities_full_2");
  let q = {name: req.params.name};
  let query = await collection.findOne(q);
  res.send(query).status(200);
});

//edit discussion
router.patch("/:name", async (req, res) => {
  let collection = await db.collection("cities_full_2");
  let q = {name: req.params.name};
  let query = await collection.findOne(q);
  const updates =  {
    $set: {
      discussion: req.body.discussion
    }
  };
  let result = await collection.updateOne(query, updates);
  res.send(result).status(200);
});




export default router;