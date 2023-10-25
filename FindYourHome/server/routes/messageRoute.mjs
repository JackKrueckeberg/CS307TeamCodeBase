import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Profile Route
const validateAndConvertId = (id) => {
  if (/^[0-9a-fA-F]{24}$/.test(id)) {
      return new ObjectId(id);
  }
  return null;
};

// get the message board for the user
router.get("/:id", async (req, res) => {
  try {
      let collection = await db.collection("users");

      const validObjectId = validateAndConvertId(req.params.id);
      if (!validObjectId) {
          return res.status(400).send("Invalid ID format");
      }

      let query = {_id: new ObjectId(validObjectId)};  // Search for the user by id
      let result = await collection.findOne(query);
  
      if (!result) return res.status(404).send("User Not found");
      else return res.status(200).send(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;