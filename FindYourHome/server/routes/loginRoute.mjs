import express from "express";
import db from "../db/conn.mjs";
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = "42d8b67e1c6dd39493ebaafee5734e5d88c69b38ad226560be3654f31b41b0d264c87020c9f7976efe41ba80df5ef8dc"; //This is randomly generated JWT token

// Login route
router.post("/login", async (req, res) => {
    try {
        let collection = await db.collection("users");
        
        // Find user by email
        let user = await collection.findOne({ email: req.body.email });
        
        // If no user found or password doesn't match
        if (!user || user.password !== req.body.password) {
            return res.status(400).json({ error: "Invalid Email or Password" });
        }

        //Assign a Remember me token to the user
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

        // If credentials are correct
        return res.status(200).json({ 
            message: "Logged in successfully",
            token: token,
            user: {
                _id: user._id.toString(),
                email: user.email
            }
        });      

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Validate the token route
router.get("/validate-token", (req, res) => {  
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ error: "Forbidden" });
            }
            
            return res.status(200).json({ 
                message: "Valid token",
                user: {
                    _id: user.userId,
                    email: user.email,
                }
            });
        });
    } else {
        res.sendStatus(401);
    }
});


export default router;