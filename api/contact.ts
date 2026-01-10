import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { desc } from 'drizzle-orm';
import * as schema from '../shared/schema';
import { OAuth2Client } from 'google-auth-library';
import { z } from 'zod';

// CORS helper
function setCorsHeaders(res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
}

// Verify Google Token
async function verifyGoogleToken(token: string) {
    try {
        if (!process.env.GOOGLE_CLIENT_ID) {
            throw new Error("GOOGLE_CLIENT_ID not configured");
        }

        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        return payload;
    } catch (error) {
        console.error("Google token verification failed:", error);
        return null;
    }
}

// Verify reCAPTCHA
async function verifyRecaptchaToken(token: string): Promise<boolean> {
    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (!secretKey) {
            console.warn("RECAPTCHA_SECRET_KEY not set");
            return false;
        }

        const response = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
            { method: "POST" }
        );

        const data = await response.json();
        return data.success === true;
    } catch (error) {
        console.error("reCAPTCHA verification failed:", error);
        return false;
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    setCorsHeaders(res);

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        console.log("Contact API called");
        const { googleToken, recaptchaToken, ...formData } = req.body;

        // Security Checks
        const isRecaptchaValid = await verifyRecaptchaToken(recaptchaToken);
        if (!isRecaptchaValid) {
            console.error("Invalid reCAPTCHA");
            return res.status(400).json({ message: "Invalid Recaptcha." });
        }

        const googleUser = await verifyGoogleToken(googleToken);
        if (!googleUser || !googleUser.email || !googleUser.sub) {
            console.error("Invalid Google authentication");
            return res.status(401).json({ message: "Invalid Authentication." });
        }

        console.log("Authenticated user:", googleUser.email);

        // Initialize database
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL not configured");
        }

        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });

        const db = drizzle(pool);

        // Rate Limiting
        const recentMessages = await db.select().from(schema.contactMessages);
        const userRecentMessages = recentMessages.filter(msg =>
            msg.googleUserId === googleUser.sub &&
            new Date().getTime() - new Date(msg.createdAt).getTime() < 24 * 60 * 60 * 1000
        );

        if (userRecentMessages.length >= 30) {
            console.error("Daily limit reached for user:", googleUser.email);
            await pool.end();
            return res.status(429).json({ message: "Daily limit reached." });
        }

        // Process and Store
        const validatedData = schema.insertContactMessageSchema.parse({
            ...formData,
            email: googleUser.email,
            googleUserId: googleUser.sub,
        });

        console.log("Saving message to database...");
        const [contactMessage] = await db
            .insert(schema.contactMessages)
            .values(validatedData)
            .returning();

        console.log("Message saved successfully with ID:", contactMessage.id);

        // Close database connection
        await pool.end();

        return res.status(201).json({
            message: "Message sent successfully.",
            id: contactMessage.id
        });

    } catch (error) {
        console.error("Contact API error:", error);

        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors
            });
        }

        return res.status(500).json({
            message: "Internal server error.",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}
