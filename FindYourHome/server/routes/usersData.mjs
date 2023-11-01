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
    let query = { email: req.params.email };  // Search by email
    let result = await collection.findOne(query);

    if (!result) return res.status(404).send("Not found");
    else return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//route the create a new user
router.post("/createUser", async (req, res) => {
  let newDocument = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  };
  console.log("in user post");
  let collection = db.collection("users");
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
  console.log("inserting user to db.");
});

//delete a user
router.delete("/:email", async (req, res) => {
  let query = { email: req.params.email };

  const collection = db.collection("users");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});

//update an existing user
  router.patch('/:email', async (req, res) => {
    const email = req.params.email;

    // Access the action and cityModel from the request body
    const { action, cityModel } = req.body;
    console.log(cityModel);
    if (action === "addRecentCity") {
      try {
        // Use MongoDB's updateOne to add the cityModel to a user's recent cities
        // Here, I'm assuming 'recentCities' is an array field in your user's document
        const result = await db.collection('users').updateOne(
          { email: email },

          {
            $push: {
              recent_cities: {
                $each: [cityModel], // Store the entire model
                $slice: -10 // Keep the last 10 cities
              }
            }
          }
        );

        if (result.matchedCount === 0) {
          res.status(404).send({ message: 'User not found' });
          return;
        }

        res.status(200).send({ message: 'City model added to recent cities' });

      } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
      }
    } else {
      res.status(400).send({ message: 'Invalid action' });
    }
  });



export default router;