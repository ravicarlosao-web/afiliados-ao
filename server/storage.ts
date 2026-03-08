import { db } from "./db";
import { eq, desc, sql, and, count } from "drizzle-orm";
import {
  users, clients, withdrawals, materials, notifications, securityLogs, settings, conversationScreenshots,
  type User, type InsertUser,
  type Client, type InsertClient,
  type Withdrawal, type InsertWithdrawal,
  type Material, type InsertMaterial,
  type Notification, type InsertNotification,
  type SecurityLog, type InsertSecurityLog,
  type ConversationScreenshot, type InsertConversationScreenshot,
  type Settings,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProfile(id: string, data: { iban?: string; multicaixaExpress?: string }): Promise<User | undefined>;
  updateUserPassword(id: string, hashedPassword: string): Promise<void>;
  toggleUserActive(id: string, isActive: boolean): Promise<User | undefined>;
  getAffiliates(): Promise<User[]>;
  getAffiliateCount(): Promise<number>;

  getClients(): Promise<Client[]>;
  getClientsByAffiliate(affiliateId: string): Promise<Client[]>;
  createClient(client: InsertClient & { status: string; price: number; commission: number }): Promise<Client>;
  getClient(id: string): Promise<Client | undefined>;
  updateClientStatus(id: string, status: string | undefined, adminNote?: string): Promise<Client | undefined>;
  updateClientSiteStarted(id: string, siteStarted: boolean): Promise<Client | undefined>;
  getClientCountByStatus(): Promise<Record<string, number>>;

  getWithdrawals(): Promise<Withdrawal[]>;
  getWithdrawalsByAffiliate(affiliateId: string): Promise<Withdrawal[]>;
  createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal>;
  updateWithdrawalStatus(id: string, status: string): Promise<Withdrawal | undefined>;
  getWithdrawalStats(): Promise<{ active: number; totalPaid: string; reserved: string }>;

  getMaterials(): Promise<Material[]>;
  getMaterial(id: string): Promise<Material | undefined>;
  createMaterial(material: InsertMaterial): Promise<Material>;
  deleteMaterial(id: string): Promise<void>;

  getNotifications(targetRole?: string, targetUserId?: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationsRead(ids: string[], userId: string): Promise<void>;

  getScreenshotsByAffiliate(affiliateId: string): Promise<ConversationScreenshot[]>;
  createScreenshot(screenshot: InsertConversationScreenshot): Promise<ConversationScreenshot>;
  deleteExpiredScreenshots(): Promise<string[]>;
  requestConversationStatus(affiliateId: string, clientId: string): Promise<Notification>;

  getSecurityLogs(): Promise<SecurityLog[]>;
  createSecurityLog(log: InsertSecurityLog): Promise<SecurityLog>;

  getSetting(key: string): Promise<string | undefined>;
  setSetting(key: string, value: string): Promise<void>;
  getAllSettings(): Promise<Settings[]>;

  getDashboardStats(): Promise<{
    activeAffiliates: number;
    totalVolume: string;
    totalCommissionPaid: string;
    pendingCommission: string;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const referralCode = `ref_${Date.now().toString(36)}`;
    const [user] = await db.insert(users).values({ ...insertUser, referralCode }).returning();
    return user;
  }

  async updateUserProfile(id: string, data: { iban?: string; multicaixaExpress?: string }): Promise<User | undefined> {
    const [updated] = await db.update(users).set({
      iban: data.iban,
      multicaixaExpress: data.multicaixaExpress,
    }).where(eq(users.id, id)).returning();
    return updated;
  }

  async updateUserPassword(id: string, hashedPassword: string): Promise<void> {
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, id));
  }

  async toggleUserActive(id: string, isActive: boolean): Promise<User | undefined> {
    const [updated] = await db.update(users).set({ isActive }).where(eq(users.id, id)).returning();
    return updated;
  }

  async getAffiliates(): Promise<User[]> {
    return db.select().from(users).where(eq(users.role, "user")).orderBy(desc(users.createdAt));
  }

  async getAffiliateCount(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(users).where(and(eq(users.role, "user"), eq(users.isActive, true)));
    return result.count;
  }

  async getClients(): Promise<Client[]> {
    return db.select().from(clients).orderBy(desc(clients.createdAt));
  }

  async getClientsByAffiliate(affiliateId: string): Promise<Client[]> {
    return db.select().from(clients).where(eq(clients.affiliateId, affiliateId)).orderBy(desc(clients.createdAt));
  }

  async createClient(client: InsertClient & { status: string; price: number; commission: number }): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  async getClient(id: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async updateClientStatus(id: string, status: string | undefined, adminNote?: string): Promise<Client | undefined> {
    const updateData: any = {};
    if (status) updateData.status = status as any;
    if (adminNote !== undefined) updateData.adminNote = adminNote;
    if (Object.keys(updateData).length === 0) return this.getClient(id);
    const [updated] = await db.update(clients).set(updateData).where(eq(clients.id, id)).returning();
    return updated;
  }

  async updateClientSiteStarted(id: string, siteStarted: boolean): Promise<Client | undefined> {
    const [updated] = await db.update(clients).set({ siteStarted }).where(eq(clients.id, id)).returning();
    return updated;
  }

  async getClientCountByStatus(): Promise<Record<string, number>> {
    const result = await db.select({
      status: clients.status,
      count: count(),
    }).from(clients).groupBy(clients.status);
    const counts: Record<string, number> = {};
    for (const r of result) {
      counts[r.status] = r.count;
    }
    return counts;
  }

  async getWithdrawals(): Promise<Withdrawal[]> {
    return db.select().from(withdrawals).orderBy(desc(withdrawals.createdAt));
  }

  async getWithdrawalsByAffiliate(affiliateId: string): Promise<Withdrawal[]> {
    return db.select().from(withdrawals).where(eq(withdrawals.affiliateId, affiliateId)).orderBy(desc(withdrawals.createdAt));
  }

  async createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal> {
    const [w] = await db.insert(withdrawals).values(withdrawal).returning();
    return w;
  }

  async updateWithdrawalStatus(id: string, status: string): Promise<Withdrawal | undefined> {
    const [updated] = await db.update(withdrawals).set({ status: status as any }).where(eq(withdrawals.id, id)).returning();
    return updated;
  }

  async getWithdrawalStats(): Promise<{ active: number; totalPaid: string; reserved: string }> {
    const activeResult = await db.select({ count: count() }).from(withdrawals).where(eq(withdrawals.status, "pendente"));
    const paidResult = await db.select({ total: sql<string>`COALESCE(SUM(CAST(amount AS REAL)), 0)` }).from(withdrawals).where(eq(withdrawals.status, "pago"));
    const reservedResult = await db.select({ total: sql<string>`COALESCE(SUM(CAST(amount AS REAL)), 0)` }).from(withdrawals).where(eq(withdrawals.status, "processando"));
    return {
      active: activeResult[0].count,
      totalPaid: String(paidResult[0].total),
      reserved: String(reservedResult[0].total),
    };
  }

  async getMaterials(): Promise<Material[]> {
    return db.select().from(materials).orderBy(desc(materials.createdAt));
  }

  async getMaterial(id: string): Promise<Material | undefined> {
    const [m] = await db.select().from(materials).where(eq(materials.id, id));
    return m;
  }

  async createMaterial(material: InsertMaterial): Promise<Material> {
    const [m] = await db.insert(materials).values(material).returning();
    return m;
  }

  async deleteMaterial(id: string): Promise<void> {
    await db.delete(materials).where(eq(materials.id, id));
  }

  private parseNotificationChannels(notifs: Notification[]): Notification[] {
    return notifs.map(n => ({
      ...n,
      channels: n.channels ? (typeof n.channels === "string" ? JSON.parse(n.channels) : n.channels) : null,
    })) as Notification[];
  }

  async getNotifications(targetRole?: string, targetUserId?: string): Promise<Notification[]> {
    let results: Notification[];
    if (targetUserId) {
      results = await db.select().from(notifications)
        .where(sql`${notifications.targetUserId} = ${targetUserId} OR ${notifications.targetRole} = 'user' OR ${notifications.targetRole} IS NULL`)
        .orderBy(desc(notifications.createdAt));
    } else {
      results = await db.select().from(notifications).orderBy(desc(notifications.createdAt));
    }
    return this.parseNotificationChannels(results);
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const channelsJson = notification.channels ? JSON.stringify(notification.channels) : null;
    const [n] = await db.insert(notifications).values({
      ...notification,
      channels: channelsJson,
    } as any).returning();
    return n;
  }

  async markNotificationsRead(ids: string[], userId: string): Promise<void> {
    for (const id of ids) {
      await db.update(notifications).set({ isRead: true } as any).where(
        and(eq(notifications.id, id), sql`(${notifications.targetUserId} = ${userId} OR ${notifications.targetRole} = 'user' OR ${notifications.targetRole} IS NULL)`)
      );
    }
  }

  async getScreenshotsByAffiliate(affiliateId: string): Promise<ConversationScreenshot[]> {
    const now = new Date();
    return db.select().from(conversationScreenshots)
      .where(and(eq(conversationScreenshots.affiliateId, affiliateId), sql`${conversationScreenshots.expiresAt} > ${now}`))
      .orderBy(desc(conversationScreenshots.createdAt));
  }

  async createScreenshot(screenshot: InsertConversationScreenshot): Promise<ConversationScreenshot> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3);
    const [s] = await db.insert(conversationScreenshots).values({
      ...screenshot,
      expiresAt,
    } as any).returning();
    return s;
  }

  async deleteExpiredScreenshots(): Promise<string[]> {
    const now = new Date();
    const expired = await db.select().from(conversationScreenshots)
      .where(sql`${conversationScreenshots.expiresAt} <= ${now}`);
    const publicIds = expired.map(s => s.cloudinaryPublicId);
    if (expired.length > 0) {
      await db.delete(conversationScreenshots).where(sql`${conversationScreenshots.expiresAt} <= ${now}`);
    }
    return publicIds;
  }

  async requestConversationStatus(affiliateId: string, clientId: string): Promise<Notification> {
    const client = await this.getClient(clientId);
    const affiliate = await this.getUser(affiliateId);
    return this.createNotification({
      title: `Pedido de Print — Cliente "${client?.name || "Desconhecido"}"`,
      description: `O afiliado "${affiliate?.name || ""}" solicitou prints da conversa com o cliente "${client?.name || ""}" (${client?.contact || ""}).`,
      type: "info",
      targetRole: "admin",
      targetUserId: null,
      channels: JSON.stringify({ affiliateId, clientId }),
    });
  }

  async getSecurityLogs(): Promise<SecurityLog[]> {
    return db.select().from(securityLogs).orderBy(desc(securityLogs.createdAt)).limit(50);
  }

  async createSecurityLog(log: InsertSecurityLog): Promise<SecurityLog> {
    const [l] = await db.insert(securityLogs).values(log).returning();
    return l;
  }

  async getSetting(key: string): Promise<string | undefined> {
    const [s] = await db.select().from(settings).where(eq(settings.key, key));
    return s?.value;
  }

  async setSetting(key: string, value: string): Promise<void> {
    const existing = await this.getSetting(key);
    if (existing !== undefined) {
      await db.update(settings).set({ value }).where(eq(settings.key, key));
    } else {
      await db.insert(settings).values({ key, value });
    }
  }

  async getAllSettings(): Promise<Settings[]> {
    return db.select().from(settings);
  }

  async getDashboardStats(): Promise<{
    activeAffiliates: number;
    totalVolume: string;
    totalCommissionPaid: string;
    pendingCommission: string;
  }> {
    const affiliateCount = await this.getAffiliateCount();

    const volumeResult = await db.select({
      total: sql<number>`COALESCE(SUM(price), 0)`,
    }).from(clients).where(eq(clients.status, "pagamento_feito"));

    const commPaidResult = await db.select({
      total: sql<number>`COALESCE(SUM(commission), 0)`,
    }).from(clients).where(eq(clients.status, "pagamento_feito"));

    const pendingResult = await db.select({
      total: sql<number>`COALESCE(SUM(commission), 0)`,
    }).from(clients).where(sql`${clients.status} IN ('em_analise', 'em_contacto')`);

    return {
      activeAffiliates: affiliateCount,
      totalVolume: String(volumeResult[0].total || 0),
      totalCommissionPaid: String(commPaidResult[0].total || 0),
      pendingCommission: String(pendingResult[0].total || 0),
    };
  }
}

export const storage = new DatabaseStorage();
