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
router.get("/check-username/:username", async (req, res) => {
    const requestedUsername = req.params.username;
    const collection = db.collection("users");
  
    // Check if the requested username already exists in the database
    const existingUser = await collection.findOne({ username: requestedUsername });
  
    if (existingUser) {
      // Username is already in use
      res.json({ isAvailable: false });
    } else {
      // Username is available
      res.json({ isAvailable: true });
    }
  });