import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "user"] }).notNull().default("user"),
  iban: text("iban"),
  multicaixaExpress: text("multicaixa_express"),
  referralCode: text("referral_code"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const clients = sqliteTable("clients", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  plan: text("plan").notNull(),
  status: text("status", { enum: ["em_analise", "em_contacto", "pagamento_feito", "reprovado"] }).notNull().default("em_analise"),
  affiliateId: text("affiliate_id").notNull().references(() => users.id),
  price: text("price").notNull().default("0"),
  commission: text("commission").notNull().default("0"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const withdrawals = sqliteTable("withdrawals", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  affiliateId: text("affiliate_id").notNull().references(() => users.id),
  amount: text("amount").notNull(),
  method: text("method").notNull(),
  accountInfo: text("account_info"),
  status: text("status", { enum: ["pendente", "processando", "pago", "recusado"] }).notNull().default("pendente"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const materials = sqliteTable("materials", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  type: text("type", { enum: ["copy", "script", "image"] }).notNull(),
  content: text("content"),
  imageUrl: text("image_url"),
  cloudinaryPublicId: text("cloudinary_public_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull().default("info"),
  targetRole: text("target_role"),
  targetUserId: text("target_user_id").references(() => users.id),
  channels: text("channels"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const securityLogs = sqliteTable("security_logs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  action: text("action").notNull(),
  userId: text("user_id").references(() => users.id),
  userLabel: text("user_label"),
  ip: text("ip"),
  status: text("status", { enum: ["success", "warning", "error"] }).notNull().default("success"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const settings = sqliteTable("settings", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, referralCode: true });
export const insertClientSchema = createInsertSchema(clients).omit({ id: true, createdAt: true });
export const insertWithdrawalSchema = createInsertSchema(withdrawals).omit({ id: true, createdAt: true });
export const insertMaterialSchema = createInsertSchema(materials).omit({ id: true, createdAt: true, cloudinaryPublicId: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertSecurityLogSchema = createInsertSchema(securityLogs).omit({ id: true, createdAt: true });

export const loginSchema = z.object({
  phone: z.string().min(1),
  password: z.string().min(1),
});

export const updateProfileSchema = z.object({
  iban: z.string().optional().nullable(),
  multicaixaExpress: z.string().optional().nullable(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Withdrawal = typeof withdrawals.$inferSelect;
export type InsertWithdrawal = z.infer<typeof insertWithdrawalSchema>;
export type Material = typeof materials.$inferSelect;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type SecurityLog = typeof securityLogs.$inferSelect;
export type InsertSecurityLog = z.infer<typeof insertSecurityLogSchema>;
export type Settings = typeof settings.$inferSelect;
