import { OAuth2Client } from 'google-auth-library';

// We initialize client lazily or check env in function to avoid crash on startup if env missing
export async function verifyGoogleToken(token: string) {
    if (!process.env.GOOGLE_CLIENT_ID) {
        console.error("GOOGLE_CLIENT_ID not set");
        return null;
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        return ticket.getPayload();
    } catch (error) {
        console.error("Google token verification failed:", error);
        return null;
    }
}
