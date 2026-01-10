import "dotenv/config";
import express from "express";
import { storage } from "../server/storage";
import { insertContactMessageSchema } from "../shared/schema";
import { z } from "zod";
import { verifyGoogleToken } from "../server/auth/google";
import { verifyRecaptchaToken } from "../server/middleware/recaptcha";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS headers for Vercel
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    next();
});

// Handles contact form submissions with validation and notifications
app.post("/api/contact", async (req, res) => {
    try {
        console.log("Contact API called with body:", JSON.stringify(req.body));
        const { googleToken, recaptchaToken, ...formData } = req.body;

        // Security Checks
        const isRecaptchaValid = await verifyRecaptchaToken(recaptchaToken);
        if (!isRecaptchaValid) {
            return res.status(400).json({ message: "Invalid Recaptcha." });
        }

        const googleUser = await verifyGoogleToken(googleToken);
        console.log("Authenticated user:", googleUser?.email);
        if (!googleUser || !googleUser.email || !googleUser.sub) {
            return res.status(401).json({ message: "Invalid Authentication." });
        }

        // Rate Limiting
        const recentMessages = await storage.getContactMessages();
        const userRecentMessages = recentMessages.filter(msg =>
            msg.googleUserId === googleUser.sub &&
            new Date().getTime() - new Date(msg.createdAt).getTime() < 24 * 60 * 60 * 1000
        );

        if (userRecentMessages.length >= 30) {
            return res.status(429).json({ message: "Daily limit reached." });
        }

        // Process and Store
        const validatedData = insertContactMessageSchema.parse({
            ...formData,
            email: googleUser.email,
            googleUserId: googleUser.sub,
        });

        console.log("Saving message to database...");
        const contactMessage = await storage.createContactMessage(validatedData);
        console.log("Message saved successfully with ID:", contactMessage.id);

        /*
        // Async Email - commented out as per user request
        sendContactEmail({
          fullName: `${contactMessage.firstName} ${contactMessage.lastName}`,
          email: contactMessage.email,
          phone: contactMessage.phoneNumber,
          message: contactMessage.message,
          date: contactMessage.createdAt
        }).catch(err => console.error("Email failed:", err));
        */

        res.status(201).json({
            message: "Message sent successfully.",
            id: contactMessage.id
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: "Validation error", errors: error.errors });
        } else {
            console.error("Contact API error:", error);
            res.status(500).json({ message: "Internal server error." });
        }
    }
});

export default app;
