import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.post("/create", async (req, res) => {
    let newDocument = {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    };
    let collection = await db.collection("users");
    let result = await collection.insertOne(newDocument);

    if (result.insertedCount === 1) {  // Check if the document was successfully inserted
      res.status(201).send({ message: "User account created successfully" });
    } else {
        res.status(500).send({ message: "An error occurred while creating the account" });
    }
});

export default router;