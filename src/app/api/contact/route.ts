import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
export const runtime = "edge";

// Connect to MongoDB
const connectMongoDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI as string);
};

// Define a Mongoose schema and model
const contactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  subject: String,
  message: String,
});

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      await connectMongoDB();

      const { firstName, lastName, email, phoneNumber, subject, message } =
        req.body;

      // Save to MongoDB
      const newContact = new Contact({
        firstName,
        lastName,
        email,
        phoneNumber,
        subject,
        message,
      });
      await newContact.save();

      // Send email to admin
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.ADMIN_EMAIL,
          pass: process.env.ADMIN_EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: email,
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact Form Submission: ${subject}`,
        text: `You have a new contact form submission from ${firstName} ${lastName}.\n\nMessage:\n${message}\n\nContact Details:\nEmail: ${email}\nPhone: ${phoneNumber}`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "Form submitted successfully" });
    } catch (error) {
      console.error("Failed to submit form:", error);
      res.status(500).json({ error: "Failed to submit form" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
