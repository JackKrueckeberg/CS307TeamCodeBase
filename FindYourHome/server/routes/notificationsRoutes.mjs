import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Profile Route
const validateAndConvertId = (id) => {
  if (/^[0-9a-fA-F]{24}$/.test(id)) {
      return new ObjectId(id);
  }
  return null;
};

// send favorites to another user
router.post("/notify", async (req, res) => {
  const { senderUsername, recipientUsername, isMessage, timeSent, city } = req.body;

  try {
    const collection = await db. collection("users");
    const recipient = await collection.findOne({ username: recipientUsername});
    const sender = await collection.findOne({ username: senderUsername });

    const notification = {
        content: "",
        time: timeSent,
    };

    if (isMessage) {
        notification.content = `${senderUsername} sent you a message`;
    } else {
        notification.content = `${senderUsername} tagged you in a post under ${city}`;
    }
    
    if (recipient && sender) {
      if (!recipient.notifications) {
        recipient.notifications= [];
      } 

      if (recipient.notifications) {
        recipient.notifications.push(notification);
        
        await collection.updateOne(
          { username: recipientUsername },
          { $set: { notifications: recipient.notifications } }
        );

        return res.status(200).send("Notified successfully.");
      }
    }
    return res.status(400).send("Recipient or sender not found.");
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
});

// update the favorite searches list
router.patch("/:id", async (req, res) => {
    try {
        let collection = await db.collection("users");
        const validObjectId = validateAndConvertId(req.params.id);
        if (!validObjectId) {
            return res.status(400).send("Invalid ID format");
        }

        let q = {_id: new ObjectId(validObjectId)};
        let query = await collection.findOne(q);
        const updates =  {
            $set: {
                notifications: req.body.notifications
            }
        };
    
        let result = await collection.updateOne(query, updates);
    
        res.send(result).status(200);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

export default router;