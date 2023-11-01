import express, { Router } from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();
router.get("/:email", async (req, res) => {
    try {
      let collection = await db.collection("users");
      let query = { email: req.params.email };  // Search by email
      let result = await collection.findOne(query);
  
      if (!result) return res.status(404).send("Not found");
      else return res.status(200).send(result.achievements);  // Send only the achievements data
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  export default router;