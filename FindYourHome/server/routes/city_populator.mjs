import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// This section will help you get a list of all the citites.
router.get("/", async (req, res) => {
  let collection = await db.collection("cities");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("records");
  let query = {_id: new ObjectId(req.params.id)};
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new city.
router.post("/", async (req, res) => {
  let newDocument = {
    name: req.body.name,
    population: req.body.population,
    //density: req.body.density,
    //gdp: req.body.gdp,
    region: req.body.timezone,
    state: req.body.state,
    lat: req.body.lat,
    lon: req.body.lon,
    zip_code: req.body.zip_code,
    county: req.body.county,
    median_income: req.body.median_income
    //weather: req.body.weather
  };
  let collection = await db.collection("cities_full_2");
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
  console.log("inserting city to db.");
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const updates =  {
    $set: {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level
    }
  };

  let collection = await db.collection("records");
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };

  const collection = db.collection("records");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});

export default router;