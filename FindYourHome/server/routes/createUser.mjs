import express, { Router } from "express";
import db from "../db/conn.mjs";

const router = express.Router();

router.post("/", async (req, res) => {
    let newDocument = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    };
    let collection = db.collection("users");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
    console.log("inserting user to db.");
  });

export default router;