import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const roleEnum = pgEnum("role", ["admin", "user"]);
export const clientStatusEnum = pgEnum("client_status", ["em_analise", "em_contacto", "pagamento_feito", "reprovado"]);
export const withdrawalStatusEnum = pgEnum("withdrawal_status", ["pendente", "processando", "pago", "recusado"]);
export const materialTypeEnum = pgEnum("material_type", ["copy", "script", "image"]);
export const logStatusEnum = pgEnum("log_status", ["success", "warning", "error"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  password: text("password").notNull(),
  role: roleEnum("role").notNull().default("user"),
  iban: text("iban"),
  multicaixaExpress: text("multicaixa_express"),
  referralCode: text("referral_code"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  plan: text("plan").notNull(),
  status: clientStatusEnum("status").notNull().default("em_analise"),
  affiliateId: varchar("affiliate_id").notNull().references(() => users.id),
  price: decimal("price", { precision: 12, scale: 2 }).notNull().default("0"),
  commission: decimal("commission", { precision: 12, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const withdrawals = pgTable("withdrawals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  affiliateId: varchar("affiliate_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  method: text("method").notNull(),
  accountInfo: text("account_info"),
  status: withdrawalStatusEnum("status").notNull().default("pendente"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const materials = pgTable("materials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  type: materialTypeEnum("type").notNull(),
  content: text("content"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull().default("info"),
  targetRole: roleEnum("target_role"),
  targetUserId: varchar("target_user_id").references(() => users.id),
  channels: text("channels").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const securityLogs = pgTable("security_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  action: text("action").notNull(),
  userId: varchar("user_id").references(() => users.id),
  userLabel: text("user_label"),
  ip: text("ip"),
  status: logStatusEnum("status").notNull().default("success"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, referralCode: true });
export const insertClientSchema = createInsertSchema(clients).omit({ id: true, createdAt: true });
export const insertWithdrawalSchema = createInsertSchema(withdrawals).omit({ id: true, createdAt: true });
export const insertMaterialSchema = createInsertSchema(materials).omit({ id: true, createdAt: true });
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
