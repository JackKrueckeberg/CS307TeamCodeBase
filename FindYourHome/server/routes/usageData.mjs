import express, { Router } from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.patch('/:email/:cityName', async (req, res) => {
    const { email, cityName } = req.params;

    // Access the action from the request body
    const { action } = req.body;

    if (action !== "incrementCityUsage") {
        return res.status(400).send({ message: 'Invalid action' });
    }

    try {
        // First, ensure the user document exists
        const user = await db.collection('users').findOne({ email: email });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Check if the city already exists in the user's usage_stats
        if (user.usage_stats && user.usage_stats[cityName] !== undefined) {
            // Increment the existing city's count
            await db.collection('users').updateOne(
                { email: email },
                { $inc: { [`usage_stats.${cityName}`]: 1 } }
            );
        } else {
            // Add the city to usage_stats with a count of 1
            await db.collection('users').updateOne(
                { email: email },
                { 
                    $set: { [`usage_stats.${cityName}`]: 1 }
                }
            );
        }

        res.status(200).send({ message: `Usage updated for ${cityName}` });

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

export default router;