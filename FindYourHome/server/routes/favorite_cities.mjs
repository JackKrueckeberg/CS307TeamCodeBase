import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// update the favorite searches list
router.patch("/:email", async (req, res) => {
  let collection = await db.collection("users");
  let q = {email: req.params.email};  // Search by email
  let query = await collection.findOne(q);
    const updates =  {
      $set: {
        favorite_cities: req.body.favorite_cities
      }
    };
  
    let result = await collection.updateOne(query, updates);
  
    res.send(result).status(200);
});

router.get("/:email", async (req, res) => {
  try {
      const collection = await db.collection("users");
      const userEmail = req.params.email;
      const userDoc = await collection.findOne({ email: userEmail });

      if (!userDoc) {
          return res.status(404).send({ message: "User not found" });
      }

      const favoriteCities = userDoc.favorite_cities || [];
      res.status(200).send(favoriteCities);
  } catch (error) {
      console.error("Error retrieving favorite cities:", error);
      res.status(500).send({ message: "Internal server error" });
  }
});

export default router;