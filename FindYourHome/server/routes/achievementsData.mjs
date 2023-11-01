import express, { Router } from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);
  next();
});



router.patch('/:email/:achievementName', async (req, res) => {
  const email = req.params.email;
  const achievementName = req.params.achievementName;
  
  // Access the action from the request body
  const { action } = req.body;
  
  if (action === "incrementAchievement") {
    try {
      // Increment the specified achievement
      const result = await db.collection('users').updateOne(
        { email: email },
        {
          $inc: {
            [`achievements.${achievementName}`]: 1
          }
        }
      );

      if (result.matchedCount === 0) {
        res.status(404).send({ message: 'User not found' });
        return;
      }

      res.status(200).send({ message: `Incremented ${achievementName}` });

    } catch (error) {
      res.status(500).send({ message: 'Internal Server Error' });
    }
  } else {
    res.status(400).send({ message: 'Invalid action' });
  }
});


export default router;
