import express, { Router } from "express";
import db from "../db/conn.mjs";

const router = express.Router();

router.post("/", async (req, res) => {
  let newDocument = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    favorite_cities: [],
    recent_searches: [],
    recent_cities: [],
    bio: "",
    favorite_searches: [],
    profile_image: "",
    strikes: {
      comments_removed: 0,
      is_banned: false
    },
    achievements: {
      city_searches: 0
    },
    bookmarked_discussions: [],
    favorite_discussions: []
  };
  // console.log(newDocument);
  let collection = db.collection("users");
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
  console.log("inserting user to db.");
});

export default router;