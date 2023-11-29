import express from "express";
import db from "../db/conn.mjs";
import nodemailer from 'nodemailer';

const router = express.Router();


router.post('/send-error-email', async (req, res) => {
    let collection = await db.collection("users");
    let user = await collection.findOne({ email: email });
    if (!user) {
        return res.status(404).send('User not found');
    }

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
});

export default router;