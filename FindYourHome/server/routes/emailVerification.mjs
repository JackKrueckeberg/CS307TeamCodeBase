import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/send-verification-email', async (req, res) => {
    // Extract email from request
    const email = req.body.email;
    
    // Generate a unique code for verification
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store code in the database with an expiration time
    const query = { email: email };
    const updates = {
        $set: {
            verificationCode: verificationCode,
            verificationCodeExpires: new Date(new Date().getTime() + 1*60*60*1000) // 1 hour from current time
        }
    };
    let collection = await db.collection("users");
    await collection.updateOne(query, updates);

    // Set up nodemailer
    let transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port: 587,
        secure: false, 
        auth: {
            user: 'findyourhomeapplication@gmail.com',
            pass: 'suelvecwwnwskgck' 
        }
    });

    let mailOptions = {
        from: 'findyourhomeapplication@gmail.com',
        to: email,
        subject: 'Your Verification Code',
        text: `Your verification code is: ${verificationCode}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error sending verification email.' });
        } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ message: 'Verification email sent!' });
        }
    });
});

router.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;

    // Fetch the code from the database
    let collection = await db.collection("users");
    const user = await collection.findOne({ email: email });

    if(!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    if(user.verificationCode !== code) {
        return res.status(400).json({ error: 'Invalid verification code.' });
    }

    if(new Date() > user.verificationCodeExpires) {
        return res.status(400).json({ error: 'Verification code has expired.' });
    }

    // If correct, mark the user's email as verified in the database
    const updates = {
        $set: { emailVerified: true },
        $unset: { verificationCode: 1, verificationCodeExpires: 1 } // remove the fields once email is verified
    };

    await collection.updateOne({ email: email }, updates);
    return res.status(200).json({ message: 'Email verified!' });
});

export default router;