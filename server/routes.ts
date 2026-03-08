import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import MemoryStore from "memorystore";
import { storage } from "./storage";
import { loginSchema, insertUserSchema, insertClientSchema, insertWithdrawalSchema, insertMaterialSchema, insertNotificationSchema, updateProfileSchema, changePasswordSchema } from "@shared/schema";
import bcrypt from "bcrypt";

const SessionStore = MemoryStore(session);

function requireAuth(req: Request, res: Response, next: Function) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Não autenticado" });
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.session?.userId || req.session?.userRole !== "admin") {
    return res.status(403).json({ message: "Acesso negado" });
  }
  next();
}

declare module "express-session" {
  interface SessionData {
    userId: string;
    userRole: string;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "afiliados-ao-secret-key-2026",
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({ checkPeriod: 86400000 }),
      cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "lax" },
    })
  );

  app.get("/api/seo/sitemap.xml", (_req: Request, res: Response) => {
    const today = new Date().toISOString().split("T")[0];
    res.set("Content-Type", "application/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://afiliados.ao/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://afiliados.ao/login</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`);
  });

  app.get("/api/seo/llms.txt", (_req: Request, res: Response) => {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send(`# Afiliados.ao — Plataforma de Marketing de Afiliados em Angola

## O que é
Afiliados.ao é a plataforma nº1 de marketing de afiliados em Angola, operada pela KYSdigital. Permite que qualquer pessoa ganhe dinheiro na internet indicando serviços de criação de websites para empresas angolanas.

## Como funciona
1. Cadastre-se gratuitamente em afiliados.ao
2. Encontre empresas que precisam de websites
3. Indique os serviços de criação de websites
4. Quando a venda é confirmada, receba comissão de até 70.000 Kz

## Planos e Comissões
- Website Essencial: 130.000 Kz (comissão do afiliado: 20.000 Kz)
- Website Profissional: 250.000 Kz (comissão do afiliado: 40.000 Kz)
- Website Premium: 400.000 Kz (comissão do afiliado: 70.000 Kz)

## Formas de Pagamento ao Afiliado
- Transferência bancária IBAN
- Unitel Money
- Afrimoney

## Perguntas Frequentes
- É grátis? Sim, o cadastro é 100% gratuito
- Preciso de experiência? Não, qualquer pessoa pode participar
- Quanto posso ganhar? Não há limite. Depende do número de vendas
- Como recebo? Via IBAN, Unitel Money ou Afrimoney
- É confiável? Sim, operado pela KYSdigital com painel transparente

## Contacto
Email: suporte@afiliados.ao
Website: https://afiliados.ao

## Palavras-chave
ganhar dinheiro na internet angola, marketing de afiliados angola, renda extra angola, trabalhar pela internet angola, comissões online angola, programa de afiliados angola
`);
  });

  // === AUTH ===
  app.post("/api/auth/register", async (req, res) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });

      const existing = await storage.getUserByPhone(parsed.data.phone);
      if (existing) return res.status(409).json({ message: "Este número já está cadastrado" });

      const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
      const user = await storage.createUser({ ...parsed.data, password: hashedPassword });

      await storage.createSecurityLog({
        action: "Novo Registo",
        userId: user.id,
        userLabel: user.name,
        ip: req.ip || "unknown",
        status: "success",
      });

      res.status(201).json({ message: "Conta criada com sucesso", user: { id: user.id, name: user.name, role: user.role } });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Dados inválidos" });

      const user = await storage.getUserByPhone(parsed.data.phone);
      if (!user) {
        await storage.createSecurityLog({
          action: "Tentativa de Login Falhou",
          userLabel: parsed.data.phone,
          ip: req.ip || "unknown",
          status: "error",
        });
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const valid = await bcrypt.compare(parsed.data.password, user.password);
      if (!valid) {
        await storage.createSecurityLog({
          action: "Tentativa de Login Falhou",
          userId: user.id,
          userLabel: user.name,
          ip: req.ip || "unknown",
          status: "error",
        });
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      req.session.userId = user.id;
      req.session.userRole = user.role;

      await storage.createSecurityLog({
        action: "Login Bem-Sucedido",
        userId: user.id,
        userLabel: user.name,
        ip: req.ip || "unknown",
        status: "success",
      });

      res.json({ user: { id: user.id, name: user.name, role: user.role, phone: user.phone } });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Sessão encerrada" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session?.userId) return res.status(401).json({ message: "Não autenticado" });
    const user = await storage.getUser(req.session.userId);
    if (!user) return res.status(401).json({ message: "Utilizador não encontrado" });
    res.json({ id: user.id, name: user.name, role: user.role, phone: user.phone, iban: user.iban, multicaixaExpress: user.multicaixaExpress, referralCode: user.referralCode, isActive: user.isActive, createdAt: user.createdAt });
  });

  // === ADMIN: DASHBOARD ===
  app.get("/api/admin/dashboard", requireAdmin, async (_req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === ADMIN: AFFILIATES ===
  app.get("/api/admin/affiliates", requireAdmin, async (_req, res) => {
    try {
      const affiliates = await storage.getAffiliates();
      res.json(affiliates.map(a => ({ id: a.id, name: a.name, phone: a.phone, isActive: a.isActive, createdAt: a.createdAt, referralCode: a.referralCode })));
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === ADMIN: CLIENTS ===
  app.get("/api/admin/clients", requireAdmin, async (_req, res) => {
    try {
      const allClients = await storage.getClients();
      res.json(allClients);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/clients/:id/status", requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const updated = await storage.updateClientStatus(req.params.id, status);
      if (!updated) return res.status(404).json({ message: "Cliente não encontrado" });

      await storage.createSecurityLog({
        action: `Status de Cliente Alterado para ${status}`,
        userId: req.session.userId,
        userLabel: `Admin`,
        ip: req.ip || "unknown",
        status: "warning",
      });

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === ADMIN: WITHDRAWALS ===
  app.get("/api/admin/withdrawals", requireAdmin, async (_req, res) => {
    try {
      const allWithdrawals = await storage.getWithdrawals();
      res.json(allWithdrawals);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/withdrawals/stats", requireAdmin, async (_req, res) => {
    try {
      const stats = await storage.getWithdrawalStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/withdrawals/:id/status", requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const updated = await storage.updateWithdrawalStatus(req.params.id, status);
      if (!updated) return res.status(404).json({ message: "Saque não encontrado" });

      await storage.createSecurityLog({
        action: `Saque ${status === 'pago' ? 'Aprovado' : status === 'recusado' ? 'Recusado' : 'Atualizado'}`,
        userId: req.session.userId,
        userLabel: "Admin",
        ip: req.ip || "unknown",
        status: status === 'recusado' ? 'error' : 'success',
      });

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === ADMIN: MATERIALS ===
  app.get("/api/admin/materials", requireAdmin, async (_req, res) => {
    try {
      const mats = await storage.getMaterials();
      res.json(mats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/materials", requireAdmin, async (req, res) => {
    try {
      const parsed = insertMaterialSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Dados inválidos" });
      const material = await storage.createMaterial(parsed.data);
      res.status(201).json(material);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/admin/materials/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteMaterial(req.params.id);
      res.json({ message: "Material removido" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === ADMIN: NOTIFICATIONS ===
  app.get("/api/admin/notifications", requireAdmin, async (_req, res) => {
    try {
      const notifs = await storage.getNotifications();
      res.json(notifs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/notifications", requireAdmin, async (req, res) => {
    try {
      const parsed = insertNotificationSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Dados inválidos" });
      const notif = await storage.createNotification(parsed.data);
      res.status(201).json(notif);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === ADMIN: SECURITY LOGS ===
  app.get("/api/admin/security-logs", requireAdmin, async (_req, res) => {
    try {
      const logs = await storage.getSecurityLogs();
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === ADMIN: SETTINGS ===
  app.get("/api/admin/settings", requireAdmin, async (_req, res) => {
    try {
      const allSettings = await storage.getAllSettings();
      const settingsMap: Record<string, string> = {};
      for (const s of allSettings) {
        settingsMap[s.key] = s.value;
      }
      res.json(settingsMap);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const updates = req.body as Record<string, string>;
      for (const [key, value] of Object.entries(updates)) {
        await storage.setSetting(key, value);
      }

      await storage.createSecurityLog({
        action: "Configurações Atualizadas",
        userId: req.session.userId,
        userLabel: "Admin",
        ip: req.ip || "unknown",
        status: "warning",
      });

      res.json({ message: "Configurações salvas" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === USER: CLIENTS ===
  app.get("/api/user/clients", requireAuth, async (req, res) => {
    try {
      const userClients = await storage.getClientsByAffiliate(req.session.userId!);
      res.json(userClients);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/user/clients", requireAuth, async (req, res) => {
    try {
      const data = { ...req.body, affiliateId: req.session.userId! };
      const parsed = insertClientSchema.safeParse(data);
      if (!parsed.success) return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });
      const client = await storage.createClient(parsed.data);
      res.status(201).json(client);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === USER: WITHDRAWALS ===
  app.get("/api/user/withdrawals", requireAuth, async (req, res) => {
    try {
      const userWithdrawals = await storage.getWithdrawalsByAffiliate(req.session.userId!);
      res.json(userWithdrawals);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/user/withdrawals", requireAuth, async (req, res) => {
    try {
      const data = { ...req.body, affiliateId: req.session.userId! };
      const parsed = insertWithdrawalSchema.safeParse(data);
      if (!parsed.success) return res.status(400).json({ message: "Dados inválidos" });
      const withdrawal = await storage.createWithdrawal(parsed.data);
      res.status(201).json(withdrawal);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === USER: NOTIFICATIONS ===
  app.get("/api/user/notifications", requireAuth, async (req, res) => {
    try {
      const notifs = await storage.getNotifications("user", req.session.userId!);
      res.json(notifs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === USER: MATERIALS ===
  app.get("/api/user/materials", requireAuth, async (_req, res) => {
    try {
      const mats = await storage.getMaterials();
      res.json(mats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === USER: PROFILE UPDATE ===
  app.patch("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const parsed = updateProfileSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });

      const updated = await storage.updateUserProfile(req.session.userId!, parsed.data);
      if (!updated) return res.status(404).json({ message: "Utilizador não encontrado" });
      res.json({ id: updated.id, name: updated.name, phone: updated.phone, iban: updated.iban, multicaixaExpress: updated.multicaixaExpress });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // === USER: CHANGE PASSWORD ===
  app.post("/api/user/change-password", requireAuth, async (req, res) => {
    try {
      const parsed = changePasswordSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten() });

      const user = await storage.getUser(req.session.userId!);
      if (!user) return res.status(404).json({ message: "Utilizador não encontrado" });

      const valid = await bcrypt.compare(parsed.data.currentPassword, user.password);
      if (!valid) return res.status(401).json({ message: "Senha atual incorreta" });

      const hashedPassword = await bcrypt.hash(parsed.data.newPassword, 10);
      await storage.updateUserPassword(req.session.userId!, hashedPassword);

      await storage.createSecurityLog({
        action: "Senha Alterada",
        userId: user.id,
        userLabel: user.name,
        ip: req.ip || "unknown",
        status: "warning",
      });

      res.json({ message: "Senha atualizada com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}
