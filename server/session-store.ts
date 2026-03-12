import session from "express-session";
import { db } from "./db";
import { sessions } from "@shared/schema";
import { eq, lt } from "drizzle-orm";

export class SQLiteSessionStore extends session.Store {
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    super();
    if (!process.env.VERCEL) {
      this.startCleanup();
    }
  }

  private startCleanup() {
    this.cleanupInterval = setInterval(() => {
      this.clearExpired();
    }, 15 * 60 * 1000);
  }

  private async clearExpired() {
    try {
      await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
    } catch {}
  }

  get(sid: string, callback: (err?: any, session?: session.SessionData | null) => void) {
    db.select().from(sessions).where(eq(sessions.sid, sid))
      .then(([row]) => {
        if (!row) return callback(null, null);
        if (row.expiresAt < new Date()) {
          this.destroy(sid, () => {});
          return callback(null, null);
        }
        try {
          callback(null, JSON.parse(row.data));
        } catch {
          callback(null, null);
        }
      })
      .catch((err) => callback(err));
  }

  set(sid: string, sessionData: session.SessionData, callback?: (err?: any) => void) {
    const maxAge = sessionData.cookie?.maxAge || 86400000;
    const expiresAt = new Date(Date.now() + maxAge);
    const data = JSON.stringify(sessionData);

    db.insert(sessions)
      .values({ sid, data, expiresAt })
      .onConflictDoUpdate({ target: sessions.sid, set: { data, expiresAt } })
      .then(() => callback?.())
      .catch((err) => callback?.(err));
  }

  destroy(sid: string, callback?: (err?: any) => void) {
    db.delete(sessions).where(eq(sessions.sid, sid))
      .then(() => callback?.())
      .catch((err) => callback?.(err));
  }

  touch(sid: string, sessionData: session.SessionData, callback?: (err?: any) => void) {
    const maxAge = sessionData.cookie?.maxAge || 86400000;
    const expiresAt = new Date(Date.now() + maxAge);

    db.update(sessions).set({ expiresAt }).where(eq(sessions.sid, sid))
      .then(() => callback?.())
      .catch((err) => callback?.(err));
  }
}
