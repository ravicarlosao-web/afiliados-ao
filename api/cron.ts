import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../server/db";
import { sessions, rateLimits, conversationScreenshots } from "../shared/schema";
import { lt } from "drizzle-orm";
import { deleteImage, isCloudinaryConfigured } from "../server/cloudinary";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const results: string[] = [];

  try {
    const deleted = await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
    results.push("Expired sessions cleaned");
  } catch (e) {
    results.push("Session cleanup failed");
  }

  try {
    await db.delete(rateLimits).where(lt(rateLimits.resetAt, Date.now()));
    results.push("Expired rate limits cleaned");
  } catch (e) {
    results.push("Rate limit cleanup failed");
  }

  try {
    const now = new Date();
    const expired = await db
      .select({ id: conversationScreenshots.id, cloudinaryPublicId: conversationScreenshots.cloudinaryPublicId })
      .from(conversationScreenshots)
      .where(lt(conversationScreenshots.expiresAt, now));

    if (expired.length > 0 && isCloudinaryConfigured()) {
      for (const screenshot of expired) {
        await deleteImage(screenshot.cloudinaryPublicId).catch(() => {});
      }
    }

    if (expired.length > 0) {
      await db.delete(conversationScreenshots).where(lt(conversationScreenshots.expiresAt, now));
    }

    results.push(`Cleaned ${expired.length} expired screenshots`);
  } catch (e) {
    results.push("Screenshot cleanup failed");
  }

  return res.status(200).json({ ok: true, results });
}
