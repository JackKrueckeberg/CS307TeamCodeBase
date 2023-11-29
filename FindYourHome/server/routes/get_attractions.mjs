import OpenAI from "openai";
import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

const openai = new OpenAI(process.env.OPEN_AI_KEY);  // Instantiate OpenAI directly with the key

router.get("/:city", async (req, res) => {
  try {
      const completion = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: "Say this is a test.",
        max_tokens: 7,
        temperature: 0,
      });
    
      res.json(completion.data);  // Send the completion data as a response
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");  // Send an error response
  }
});

export default router;
