import express from "express";
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

const router = express.Router();

router.get('/generate-secret', async (req, res) => {
    try {
        const secret = speakeasy.generateSecret({ length: 20 });
        const qrCodeData = await qrcode.toDataURL(secret.otpauth_url);
        res.status(200).json({ secret: secret.base32, qrCode: qrCodeData });
    } catch (err) {
        res.status(500).json({ error: 'Error generating QR code' });
    }
});

router.post('/verify-token', (req, res) => {
    try {
        const { token, secret } = req.body;
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token
        });

        if (verified) {
            res.json({ verified: true });
        } else {
            res.json({ verified: false });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error verifying token' });
    }
});

export default router;