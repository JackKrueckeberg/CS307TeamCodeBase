import express from "express";
import db from "../db/conn.mjs";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/send-error-email", async (req, res) => {
  const { errorTitle, errorDescription } = req.body;

  // Check if errorTitle and errorDescription are provided
  if (!errorTitle || !errorDescription) {
    return res.status(400).send("Error title and description are required");
  }

  // Set up nodemailer transporter
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "findyourhomeapplication@gmail.com",
      pass: "suelvecwwnwskgck",
    },
  });

  // Predefine the developer's email as the recipient
  const developersEmail = "findyourhomedev@gmail.com";

  // Set up email options
  let mailOptions = {
    from: "findyourhomeapplication@gmail.com",
    to: developersEmail,
    subject: `Error Report: ${errorTitle}`,
    html: `
        <div style="display: flex; justify-content: center; font-family: Arial, sans-serif; padding: 20px;">
            <div style="max-width: 600px; width: 100%; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f7f7f7;">
                <h2 style="color: #333; text-align: center;">An Error Was Reported</h2>
                <h3 style="color: #333;">Error Title:</h3>
                <p style="color: #555; font-size: 16px; line-height: 1.5;">${errorTitle}</p>
                <h3 style="color: #333;">Error Description:</h3>
                <p style="color: #555; font-size: 16px; line-height: 1.5;">${errorDescription}</p>
                <div style="background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
                    <p style="color: #2c3e50; font-size: 16px; text-align: center;">This error report has been automatically generated and sent for review.</p>
                </div>
            </div>
        </div>`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Error sending email");
    }
    console.log("Email sent: " + info.response);
    res.status(200).send("Error report email sent successfully");
  });
});

router.post("/submit-review", async (req, res) => {
  const { reviewTitle, review, rating, email } = req.body;

  if (!reviewTitle || !review || rating === 0 || !email) {
    return res
      .status(400)
      .send("Missing review title, review content, rating, or email");
  }

  try {
    await db.collection("reviews").insertOne({
      reviewTitle,
      review,
      rating,
      email,
      createdAt: new Date(),
    });
    res.status(200).send("Review submitted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving the review");
  }
});

export default router;
