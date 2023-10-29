import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// create a message board
router.post("/create-board", async (req, res) => {
    const { user1, user2, time, messages } = req.body;
    try {
      const collection = await db.collection("users");
      const user_1 = await collection.findOne({ username: user1 });
      const user_2 = await collection.findOne({ username: user2 });
  
      if (user_1 && user_2) {
        const messageBoard_1 = {
            messagesWith: user2,
            time: time,
            messages: messages,
        };

        const messageBoard_2 = {
            messagesWith: user1,
            time: time,
            messages: messages,
        };

        user_1.messageList = user_1.messageList || [];
        user_2.messageList = user_2.messageList || [];

        user_1.messageList.push(messageBoard_1);
        user_2.messageList.push(messageBoard_2);
  
        await collection.updateOne(
          { username: user1 },
          { $set: {messageList: user_1.messageList } }
        );
  
        await collection.updateOne(
          { username: user2 },
          { $set: {messageList: user_2.messageList } }
        );
  
        return res.status(200).send('New message board created!');
      }
    } catch (error) {
      console.error(error);
      return res.status(500);
    }
});
  

export default router;