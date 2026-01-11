import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
    // Warn instead of throw to allow build without DB credentials, but fail at runtime
    console.warn("DATABASE_URL is not set. Database connection will fail if attempted.");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
