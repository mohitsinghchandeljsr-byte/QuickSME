import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { sql } from "drizzle-orm";
import * as schema from "@shared/schema";

// Database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

const connection = mysql.createPool(connectionString);

export const db = drizzle(connection, { schema });

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
  await connection.end();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("Shutting down database connection...");
  await connection.end();
  process.exit(0);
});
