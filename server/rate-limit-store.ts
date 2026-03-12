import { db } from "./db";
import { rateLimits } from "@shared/schema";
import { eq, lt, and, gt } from "drizzle-orm";
import { sql } from "drizzle-orm";
import type { Store, Options, IncrementResponse, ClientRateLimitInfo } from "express-rate-limit";

let cleanupStarted = false;

function startCleanup() {
  if (cleanupStarted) return;
  cleanupStarted = true;
  const doCleanup = async () => {
    try {
      await db.delete(rateLimits).where(lt(rateLimits.resetAt, Date.now()));
    } catch {}
  };
  doCleanup();
  if (!process.env.VERCEL) {
    setInterval(doCleanup, 5 * 60 * 1000);
  }
}

export class SQLiteRateLimitStore implements Store {
  private windowMs: number = 60000;
  private prefix: string;

  constructor(prefix?: string) {
    this.prefix = prefix || "rl:";
  }

  init(options: Options): void {
    this.windowMs = options.windowMs;
    startCleanup();
  }

  private prefixedKey(key: string): string {
    return this.prefix + key;
  }

  async get(key: string): Promise<ClientRateLimitInfo | undefined> {
    const pk = this.prefixedKey(key);
    const now = Date.now();
    const rows = await db.select().from(rateLimits).where(and(eq(rateLimits.key, pk), gt(rateLimits.resetAt, now)));
    const row = rows[0];
    if (!row) return undefined;
    return { totalHits: row.hits, resetTime: new Date(row.resetAt) };
  }

  async increment(key: string): Promise<IncrementResponse> {
    const pk = this.prefixedKey(key);
    const now = Date.now();
    const resetAt = now + this.windowMs;

    await db.run(sql`INSERT INTO rate_limits (key, hits, reset_at) VALUES (${pk}, 1, ${resetAt})
      ON CONFLICT(key) DO UPDATE SET
        hits = CASE WHEN rate_limits.reset_at <= ${now} THEN 1 ELSE rate_limits.hits + 1 END,
        reset_at = CASE WHEN rate_limits.reset_at <= ${now} THEN ${resetAt} ELSE rate_limits.reset_at END`);

    const rows = await db.select().from(rateLimits).where(eq(rateLimits.key, pk));
    const row = rows[0];
    return { totalHits: row?.hits ?? 1, resetTime: new Date(row?.resetAt ?? resetAt) };
  }

  async decrement(key: string): Promise<void> {
    const pk = this.prefixedKey(key);
    await db.update(rateLimits)
      .set({ hits: sql`MAX(${rateLimits.hits} - 1, 0)` })
      .where(eq(rateLimits.key, pk));
  }

  async resetKey(key: string): Promise<void> {
    const pk = this.prefixedKey(key);
    await db.delete(rateLimits).where(eq(rateLimits.key, pk));
  }
}

const LOGIN_PREFIX = "login:";
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

export async function checkAccountLock(identifier: string): Promise<{ locked: boolean; remainingMs: number }> {
  const key = LOGIN_PREFIX + identifier;
  const now = Date.now();
  const rows = await db.select().from(rateLimits).where(and(eq(rateLimits.key, key), gt(rateLimits.resetAt, now)));
  const row = rows[0];
  if (!row) return { locked: false, remainingMs: 0 };
  if (row.hits >= MAX_LOGIN_ATTEMPTS) {
    return { locked: true, remainingMs: row.resetAt - now };
  }
  return { locked: false, remainingMs: 0 };
}

export async function recordFailedLogin(identifier: string): Promise<void> {
  const key = LOGIN_PREFIX + identifier;
  const now = Date.now();
  const resetAt = now + LOCKOUT_DURATION_MS;

  await db.run(sql`INSERT INTO rate_limits (key, hits, reset_at) VALUES (${key}, 1, ${resetAt})
    ON CONFLICT(key) DO UPDATE SET
      hits = CASE WHEN rate_limits.reset_at <= ${now} THEN 1 ELSE rate_limits.hits + 1 END,
      reset_at = CASE
        WHEN rate_limits.reset_at <= ${now} THEN ${resetAt}
        WHEN rate_limits.hits + 1 >= ${MAX_LOGIN_ATTEMPTS} THEN ${resetAt}
        ELSE rate_limits.reset_at
      END`);
}

export async function clearFailedLogins(identifier: string): Promise<void> {
  const key = LOGIN_PREFIX + identifier;
  await db.delete(rateLimits).where(eq(rateLimits.key, key));
}

export async function getRemainingAttempts(identifier: string): Promise<number> {
  const key = LOGIN_PREFIX + identifier;
  const now = Date.now();
  const rows = await db.select().from(rateLimits).where(and(eq(rateLimits.key, key), gt(rateLimits.resetAt, now)));
  const row = rows[0];
  if (!row) return MAX_LOGIN_ATTEMPTS;
  return Math.max(0, MAX_LOGIN_ATTEMPTS - row.hits);
}
