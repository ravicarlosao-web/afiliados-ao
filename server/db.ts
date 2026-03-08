import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { migrate } from "drizzle-orm/libsql/migrator";
import { sql } from "drizzle-orm";
import * as schema from "@shared/schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

async function ensureBaselineMigration() {
  await db.run(sql`CREATE TABLE IF NOT EXISTS __drizzle_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hash TEXT NOT NULL,
    created_at INTEGER
  )`);

  const existing = await db.all<{ hash: string }>(
    sql`SELECT hash FROM __drizzle_migrations WHERE hash = '0000_right_donald_blake'`
  );
  if (existing.length === 0) {
    const tablesExist = await db.all<{ name: string }>(
      sql`SELECT name FROM sqlite_master WHERE type='table' AND name='clients'`
    );
    if (tablesExist.length > 0) {
      await db.run(
        sql`INSERT INTO __drizzle_migrations (hash, created_at) VALUES ('0000_right_donald_blake', ${Date.now()})`
      );
    }
  }
}

export async function runMigrations() {
  await ensureBaselineMigration();
  await migrate(db, { migrationsFolder: "./migrations" });
}
