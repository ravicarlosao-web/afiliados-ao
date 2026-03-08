import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function seedAdmin() {
  try {
    const existingAdmins = await db.select().from(users).where(eq(users.role, "admin"));

    if (existingAdmins.length === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 12);
      await db.insert(users).values({
        name: "Admin",
        phone: "900000000",
        password: hashedPassword,
        role: "admin",
        isActive: true,
      });
      console.log("Admin user seeded: phone=900000000, password=admin123");
    }
  } catch (error) {
    console.error("Seed admin error:", error);
  }
}
