import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/send-verification-email', async (req, res) => {
    // Extract email from request
    const email = req.body.email;

    let collection = await db.collection("users");
    let user = await collection.findOne({ email: email });
    if (!user) {
        return res.status(404).send('User not found');
    }

    const firstName = user.first_name;
    
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
        subject: 'Welcome to Find Your Home!',
        html: `
        <div style="height: 100vh; display: flex; align-items: center; justify-content: center; font-family: Arial, sans-serif;">
            <div style="max-width: 600px; width: 100%; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f7f7f7;">
                <h2 style="color: #333; text-align: center;">Welcome to Find Your Home!</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.5;">
                    Hello ${firstName},
                    <br><br>
                    Thank you for registering. Below is your verification code. Please enter it on the verification page to confirm your email address.
                </p>
                <div style="background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
                    <h3 style="color: #333; text-align: center;">Your Verification Code:</h3>
                    <p style="color: #2c3e50; font-size: 24px; font-weight: bold; text-align: center;">${verificationCode}</p>
                </div>
                <p style="color: #555; font-size: 16px; line-height: 1.5; margin-top: 20px;">
                    If you didn’t request this, please ignore this email or let us know.
                    <br><br>
                    Best regards,
                    <br>
                    Find Your Home Team
                </p>
            </div>
        </div>`

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