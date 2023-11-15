import express from "express";
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { ObjectId } from 'mongodb'; // Import ObjectId from MongoDB
import db from "../db/conn.mjs";

const router = express.Router();

router.post('/generate-secret', async (req, res) => {
    try {
        let collection = await db.collection("users");
        let user = await collection.findOne({ _id: new ObjectId(req.body._id) });

        if (!user.twoFactorSecret) {
            // User doesn't have 2FA set up, generate new secret
            const secret = speakeasy.generateSecret({ length: 20 });
            const qrCodeData = await qrcode.toDataURL(secret.otpauth_url);

            // Update user's record with the new secret
            await collection.updateOne({ _id: new ObjectId(req.body._id) }, { $set: { twoFactorSecret: secret.base32 } });

            res.status(200).json({ secret: secret.base32, qrCode: qrCodeData });
        } else {
            // User already has 2FA, return existing secret
            res.status(200).json({ secret: user.twoFactorSecret, qrCode: null });
        }
    } catch (err) {
        console.log (err);
        res.status(500).json({ error: 'Error generating QR code' });
    }
});

router.post('/verify-code', async (req, res) => {
    try {
        const { token } = req.body;
        let collection = await db.collection("users");
        let user = await collection.findOne({ _id: new ObjectId(req.body._id) });

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token
        });

        if (verified) {
            res.status(200).json({ verified: true });
        } else {
            res.status(200).json({ verified: false });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error verifying token' });
    }
});

export default router;