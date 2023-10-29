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

// get the message board for the user
router.get("/messages/:id", async (req, res) => {
  try {
      let collection = await db.collection("users");

      const validObjectId = validateAndConvertId(req.params.id);
      if (!validObjectId) {
          return res.status(400).send("Invalid ID format!");
      }

      let query = {_id: new ObjectId(validObjectId)};  // Search for the user by id
      let result = await collection.findOne(query);
  
      if (!result) return res.status(404).send("User Not found");
      else return res.status(200).send(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Display messages for a specific user and recipient
router.get("/messages/:id/:recipientUsername", async (req, res) => {
  try {
    let collection = await db.collection("users");

    const validObjectId = validateAndConvertId(req.params.id);
    if (!validObjectId) {
        return res.status(400).send("Invalid ID format!");
    }

    const recipientUsername = req.params.recipientUsername;

    let query = {_id: new ObjectId(validObjectId)};  // Search for the user by id
    let result = await collection.findOne(query);

    if (result) {
      const messageBoard = result.messageList.find(
        (entry) => entry.messagesWith === recipientUsername
      );

      if (!messageBoard) {
        return res.status(404).send(`Message board not found with ${recipientUsername}.`);
      }
    
      const messages = messageBoard.messages;
      return res.status(200).json(messages);
    }

    const messages = messageBoardEntry.messages;
    return res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
});


// send favorites to another user
router.post("/share-favorite-cities", async (req, res) => {
  const { senderUsername, recipientUsername, content, timeSent } = req.body;

  try {
    const collection = await db. collection("users");
    const recipient = await collection.findOne({ username: recipientUsername});
    const sender = await collection.findOne({ username: senderUsername });

    if (recipient && sender) {
      const message = {
        sender: senderUsername,
        recipient: recipientUsername,
        content: content,
        timeSent: timeSent,
      };

      const senderMessageBoard = sender.messageList.find(
        (entry) => entry.messagesWith === recipientUsername
      );

      const recipientMessageBoard = recipient.messageList.find(
        (entry) => entry.messagesWith === senderUsername
      );

      if (recipientMessageBoard && senderMessageBoard) {
        recipientMessageBoard.messages.push(message);
        senderMessageBoard.messages.push(message);

        await collection.updateOne(
          { username: recipientUsername },
          { $set: { messageList: recipient.messageList } }
        );

        await collection.updateOne(
          { username: senderUsername },
          { $set: { messageList: sender.messageList } }
        );

        return res.status(200).send("Message shared successfully.");
      }
    }
    return res.status(400).send("Recipient or sender not found.");
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
});

export default router;