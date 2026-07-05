import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  var __dbClient: ReturnType<typeof postgres> | undefined;
}

const connectionString = process.env.DATABASE_URL!;

// Reuse a single client across Next.js dev-mode hot reloads — otherwise every
// Fast Refresh re-evaluates this module and opens a fresh connection pool
// without closing the old one, eventually exhausting Supabase's pooler.
const client =
  global.__dbClient ?? postgres(connectionString, { prepare: false, max: 10 });

if (process.env.NODE_ENV !== "production") {
  global.__dbClient = client;
}

export const db = drizzle(client, { schema });
