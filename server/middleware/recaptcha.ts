import axios from 'axios';
import type { Request, Response, NextFunction } from 'express';

export async function verifyRecaptchaToken(token: string): Promise<boolean> {
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

// Optional Express Middleware if needed
export async function requireRecaptcha(req: Request, res: Response, next: NextFunction) {
    const token = req.body.recaptchaToken;
    if (!token) {
        return res.status(400).json({ message: "Recaptcha token is required" });
    }

    const isValid = await verifyRecaptchaToken(token);
    if (!isValid) {
        return res.status(400).json({ message: "Invalid Recaptcha" });
    }

    next();
}
