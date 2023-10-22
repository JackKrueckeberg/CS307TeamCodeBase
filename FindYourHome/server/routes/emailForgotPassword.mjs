import express, { Router } from "express";
import nodemailer from 'nodemailer';
import db from "../db/conn.mjs";

const router = express.Router();
const PORT = 5050;

router.post('/send-reset-email', async (req, res) => {
    console.log("in email sender");
    const { email } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'findyourhomeapplication@gmail.com',
            pass: 'suelvecwwnwskgck'
        }
    });

    let mailOptions = {
        from: 'findyourhomeapplication@gmail.com',
        to: email,
        subject: 'Password Reset Request',
        text: 'You requested a password reset. Click this link to reset your password: [LINK]'
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