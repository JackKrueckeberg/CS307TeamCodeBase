import express, { Router } from "express";
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import db from "../db/conn.mjs";

const router = express.Router();
const PORT = 5050;

router.post('/send-reset-email', async (req, res) => {
    console.log("in email poster");
    const { email } = req.body;

    const token = crypto.randomBytes(20).toString('hex');

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'findyourhomeapplication@gmail.com',
            pass: 'suelvecwwnwskgck'
        }
    });

    console.log("Generated Token:", token);
    const resetLink = `http://localhost:3000/recover-account?token=${token}`;

    let mailOptions = {
        from: 'findyourhomeapplication@gmail.com',
        to: email,
        subject: 'FindYourHome Password Reset',
        html: `
        <div style="height: 100vh; display: flex; align-items: center; justify-content: center; font-family: Arial, sans-serif;">
            <div style="max-width: 600px; width: 100%; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f7f7f7;">
                <h2 style="color: #333; text-align: center;">Welcome to Find Your Home!</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.5;">
                    Hello,
                    <br><br>
                    We received a request from this email address for a password reset link.
                </p>
                <div style="background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
                    <h3 style="color: #333; text-align: center;">Your Pssword Reset Link:</h3>
                    <p style="color: #2c3e50; font-size: 24px; font-weight: bold; text-align: center;"><a href="${resetLink}">Reset Link</a></p>
                </div>
                <p style="color: #555; font-size: 16px; line-height: 1.5; margin-top: 20px;">
                    If you didn't request this, please ignore this email or let us know.
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
            return res.status(500).json({ error: 'Failed to send email' });
        } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ message: 'Email sent!' });
        }
    });
});

export default router; 