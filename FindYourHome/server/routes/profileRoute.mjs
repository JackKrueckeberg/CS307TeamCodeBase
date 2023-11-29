import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import multer from "multer";
import fs from "fs";
import path from "path";

const upload = multer( {dest: 'uploads/'});

const router = express.Router();

// Profile Route
const validateAndConvertId = (id) => {
  if (/^[0-9a-fA-F]{24}$/.test(id)) {
      return new ObjectId(id);
  }
  return null;
};

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

// Get user info
router.get("/profile/:id", async (req, res) => {
    try {
        let collection = await db.collection("users");

        const validObjectId = validateAndConvertId(req.params.id);
        if (!validObjectId) {
            return res.status(400).send("Invalid ID format");
        }

        let query = {_id: new ObjectId(validObjectId)};  // Search for the user by id
        let userProfile = await collection.findOne(query);
        /*if(userProfile.profile_image.filename) {
          //userProfile.image = ????
        } else {
          userProfile.image = loadImage("Default_Profile_Picture.png", "image/png");
        }*/
    
        if (!userProfile) return res.status(404).send("User Not found");
        else return res.status(200).send(userProfile);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
});

router.get("/loadImage/:id", async (req, res) => {
  let collection = await db.collection("users");
  let query = {_id: new ObjectId(req.params.id)};  // Search for the user by id
  let userProfile = await collection.findOne(query);

  let filePath = "../server/uploads/Default_Profile_Picture.png";
  let fileType = "image/png";

  console.log(userProfile);

  if (userProfile.profile_image.filename) {
    filePath = path.join('uploads/', userProfile.profile_image.filename );
    fileType = userProfile.profile_image.type;
  }

  console.log(filePath);

  fs.readFile(filePath, (error, data) => {
    if (error) {
      console.log(error);
      return;
    }
    
      res.writeHead(200, { 'Content-Type': fileType})
      res.end(data, 'utf8');
    })
  return res.status(200);
});

// Update the user info
router.patch("/update-info/:id", async (req, res) => {
    const validObjectId = validateAndConvertId(req.params.id);
    if (!validObjectId) {
        return res.status(400).send("Invalid ID format");
    }
    const query = {_id: new ObjectId(validObjectId)}; // update the user based on their id
    const updates =  {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        bio: req.body.bio,
        //profile_image: req.body.profile_image,
      }
    };
  
    let collection = await db.collection("users");
    let result = await collection.updateOne(query, updates);

    res.send(result).status(200);
});

// Update the user password
router.patch("/update-password/:id", async (req, res) => {
  const validObjectId = validateAndConvertId(req.params.id);
  if (!validObjectId) {
      return res.status(400).send("Invalid ID format");
  }
  const query = {_id: new ObjectId(validObjectId)}; // update the user based on their id

  const updates =  {
    $set: {
      password: req.body.password,
    }
  };

  let collection = await db.collection("users");
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

// Update the user profile_image
router.post("/update-image/:id", async (req, res) => {
  const validObjectId = validateAndConvertId(req.params.id);
  if (!validObjectId) {
      return res.status(400).send("Invalid ID format");
  }
  const query = {_id: new ObjectId(validObjectId)}; // update the user based on their id

  console.log(req.body);

  const updates =  {
    $set: {
      profile_image: req.body,
    }
  };

  let collection = await db.collection("users");
  let result = await collection.updateOne(query, updates);
  
  res.send(result).status(200);
});

// delete user by id

router.delete("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };

  const collection = db.collection("users");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});

router.post('/upload/:id', upload.single('profile_image'), function (req, res) {
  console.log(req.file, req.body);

  const user = {_id: new ObjectId(req.params.id)};

  let image = {
    filename: req.file.filename,
    type: req.file.mimetype,
  }

  const update = {
    $set: {
      profile_image: image,
    }
  };

  let collection = db.collection("users");
  let updatePromise = collection.updateOne(user, update);
  
  updatePromise.then(() => {
    return res.send().status(200);
  })
});


export default router;