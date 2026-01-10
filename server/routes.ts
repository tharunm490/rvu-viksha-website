import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import { verifyGoogleToken } from "./auth/google";
import { verifyRecaptchaToken } from "./middleware/recaptcha";
import { sendContactEmail } from "./services/email";

export async function registerRoutes(app: Express): Promise<Server> {
  // Handles contact form submissions with validation and notifications
  app.post("/api/contact", async (req, res) => {
    try {
      const { googleToken, recaptchaToken, ...formData } = req.body;

      // Security Checks (Logging failures but not blocking as per user request to "just save the msg")
      const isRecaptchaValid = await verifyRecaptchaToken(recaptchaToken);
      if (!isRecaptchaValid) {
        console.warn("Recaptcha verification failed, continuing anyway...");
      }

      let googleUser = await verifyGoogleToken(googleToken);
      if (!googleUser) {
        console.warn("Google Auth verification failed, using email from form data...");
        // Fallback for user identification if verification fails
        googleUser = {
          email: formData.email,
          sub: req.body.googleToken?.substring(0, 50) || "unknown_user"
        } as any;
      }

      // Rate Limiting (Still apply to prevent spam)
      const recentMessages = await storage.getContactMessages();
      const userRecentMessages = recentMessages.filter(msg =>
        msg.googleUserId === googleUser?.sub &&
        new Date().getTime() - new Date(msg.createdAt).getTime() < 24 * 60 * 60 * 1000
      );

      if (userRecentMessages.length >= 10) {
        return res.status(429).json({ message: "Daily limit reached." });
      }

      // Process and Store
      const validatedData = insertContactMessageSchema.parse({
        ...formData,
        email: googleUser!.email,
        googleUserId: googleUser!.sub,
      });

      const contactMessage = await storage.createContactMessage(validatedData);

      /*
      // Async Email
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

  app.get("/api/contact-messages", async (_req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
