import express, { Router } from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

//this route gets all the users and their data
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("users");
    let results = await collection.find({}).toArray();
    // Send the results back as JSON with a 200 status code.
    return res.send(results).status(200);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//this route helps you get a user by email
router.get("/:email", async (req, res) => {
  try {
    let collection = await db.collection("users");
    let query = {email: req.params.email};  // Search by email
    let result = await collection.findOne(query);

    if (!result) return res.status(404).send("Not found");
    else return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//route the create a new user
router.post("/", async (req, res) => {
  let newDocument = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    bio: req.body.bio,
    profile_image: req.body.profile_image
  };
  let collection = await db.collection("users");
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});

//delete a user
router.delete("/:id", async (req, res) => {
  let query = {email: req.params.email};

  const collection = db.collection("users");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});

//update an existing user
router.patch("/:email", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const updates =  {
    $set: {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    }
  };

  let collection = await db.collection("records");
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

export default router;