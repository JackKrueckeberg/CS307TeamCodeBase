import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.post("/", async (req, res) => {
    let newDocument = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    };
    let collection = await db.collection("records");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
});

export default router;