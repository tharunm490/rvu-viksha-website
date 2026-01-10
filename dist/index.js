var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  contactMessages: () => contactMessages,
  insertContactMessageSchema: () => insertContactMessageSchema,
  insertUserSchema: () => insertUserSchema,
  users: () => users
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),
  message: text("message").notNull(),
  googleUserId: text("google_user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
  message: true,
  googleUserId: true
});

// server/db.ts
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Database connection will fail if attempted.");
}
var pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
var db = drizzle(pool, { schema: schema_exports });

// server/storage.ts
import { eq, desc } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async createContactMessage(insertMessage) {
    const [message] = await db.insert(contactMessages).values(insertMessage).returning();
    return message;
  }
  async getContactMessages() {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";

// server/auth/google.ts
import { OAuth2Client } from "google-auth-library";
async function verifyGoogleToken(token) {
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.error("GOOGLE_CLIENT_ID not set");
    return null;
  }
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    return ticket.getPayload();
  } catch (error) {
    console.error("Google token verification failed:", error);
    return null;
  }
}

// server/middleware/recaptcha.ts
import axios from "axios";
async function verifyRecaptchaToken(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY is not set");
    return false;
  }
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
    );
    return response.data.success;
  } catch (error) {
    console.error("Recaptcha verification error:", error);
    return false;
  }
}

// server/services/email.ts
import { Resend } from "resend";
var escapeHtml = (text2) => text2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
async function sendContactEmail(data) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY missing. Email not sent.");
    return false;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const safeMessage = escapeHtml(data.message).replace(/\n/g, "<br>");
  const submittedAt = new Date(data.date).toLocaleString();
  try {
    console.log(`Attempting to send email to: ${process.env.EMAIL_TO || "club_viksha@rvu.edu.in"}`);
    await resend.emails.send({
      from: "Viksha Contact Form <onboarding@resend.dev>",
      to: [process.env.EMAIL_TO || "club_viksha@rv.edu.in"],
      replyTo: data.email,
      subject: "New Contact Form Submission \u2013 Viksha Coding Club",
      html: `
        <h2>New Contact Submission</h2>
        <div style="font-family: sans-serif; line-height: 1.6;">
          <p><strong>Name:</strong> ${data.fullName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || "N/A"}</p>
          <div style="background-color: #f4f4f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Message:</strong><br/>
            ${safeMessage}
          </div>
          <p style="color: #666; font-size: 12px;">
            Submitted on ${submittedAt}
          </p>
        </div>
      `
    });
    return true;
  } catch (err) {
    console.error("Email sending failed. Full error:", err?.message || err);
    return false;
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/contact", async (req, res) => {
    try {
      const { googleToken, recaptchaToken, ...formData } = req.body;
      const isRecaptchaValid = await verifyRecaptchaToken(recaptchaToken);
      if (!isRecaptchaValid) {
        return res.status(400).json({ message: "Invalid Recaptcha. Please try again." });
      }
      const googleUser = await verifyGoogleToken(googleToken);
      if (!googleUser || !googleUser.email || !googleUser.sub) {
        return res.status(401).json({ message: "Invalid Google Authentication. Please sign in again." });
      }
      const recentMessages = await storage.getContactMessages();
      const userRecentMessages = recentMessages.filter(
        (msg) => msg.googleUserId === googleUser.sub && (/* @__PURE__ */ new Date()).getTime() - new Date(msg.createdAt).getTime() < 24 * 60 * 60 * 1e3
      );
      if (userRecentMessages.length >= 10) {
        return res.status(429).json({ message: "Submission limit exceeded. You can only send 10 messages per day." });
      }
      const dataToProcess = {
        ...formData,
        email: googleUser.email,
        googleUserId: googleUser.sub
        // Ensure required fields map correctly if frontend names differ? 
        // Schema expects: firstName, lastName, phoneNumber (optional), message
      };
      const validatedData = insertContactMessageSchema.parse(dataToProcess);
      const contactMessage = await storage.createContactMessage(validatedData);
      sendContactEmail({
        fullName: `${contactMessage.firstName} ${contactMessage.lastName}`,
        email: contactMessage.email,
        phone: contactMessage.phoneNumber,
        message: contactMessage.message,
        date: contactMessage.createdAt
      }).catch((err) => console.error("Background email send failed:", err));
      res.status(201).json({
        message: "Thank you! Your message has been sent successfully.",
        id: contactMessage.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      } else {
        console.error("Error processing contact form:", error);
        res.status(500).json({
          message: "Internal server error. Please try again later."
        });
      }
    }
  });
  app2.get("/api/contact-messages", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5001", 10);
  const host = process.env.NODE_ENV === "development" ? "localhost" : "0.0.0.0";
  server.listen(port, host, () => {
    log(`serving on http://${host}:${port}`);
  });
})();
