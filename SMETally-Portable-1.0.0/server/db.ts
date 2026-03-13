import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import * as schema from "@shared/schema";

// Database connection
const connectionString = process.env.DATABASE_URL;
let db: any;

if (connectionString) {
  const client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  db = drizzle(client, { schema });
} else {
  // In-memory fallback - create a mock db object
  db = {
    execute: async () => ({ rows: [] }),
    select: () => ({ from: () => ({ where: () => ({ limit: () => [] }) }) }),
    insert: () => ({ values: () => ({ returning: () => [] }) }),
    update: () => ({ set: () => ({ where: () => ({ returning: () => [] }) }) }),
    delete: () => ({ where: () => [] }),
  };
}

export { db };

// Health check function for database connectivity
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await db.execute(sql`SELECT 1`);
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("Shutting down database connection...");
  await client.end();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("Shutting down database connection...");
  await client.end();
  process.exit(0);
});
