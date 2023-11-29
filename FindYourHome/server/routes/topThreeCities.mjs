import express from "express";
import db from "../db/conn.mjs"; // Assuming this is your database connection

const router = express.Router();

// Route to get the top three searched cities for a user
router.get('/:email', async (req, res) => {
    const { email } = req.params;

    try {
        // Fetch the user's document
        const user = await db.collection('users').findOne({ email: email });
        if (!user || !user.usage_stats) {
            return res.status(404).send({ message: 'User or usage stats not found' });
        }

        // Extracting and sorting the usage_stats to find top three cities
        const citiesArray = Object.entries(user.usage_stats);
        citiesArray.sort((a, b) => b[1] - a[1]);
        const topThreeCities = citiesArray.slice(0, 3);

        res.status(200).json(topThreeCities);

    } catch (error) {
        console.error('Error fetching top cities:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

export default router;
