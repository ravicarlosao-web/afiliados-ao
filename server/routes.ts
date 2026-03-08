import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import MemoryStore from "memorystore";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import { storage } from "./storage";
import { loginSchema, insertUserSchema, insertClientSchema, insertWithdrawalSchema, insertMaterialSchema, insertNotificationSchema, updateProfileSchema, changePasswordSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { z } from "zod";

const SessionStore = MemoryStore(session);

const loginAttempts = new Map<string, { count: number; lockedUntil: number | null }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.ip || req.socket.remoteAddress || "unknown";
}

function sanitizeString(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(v => typeof v === "string" ? sanitizeString(v) : v);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

function checkAccountLock(identifier: string): { locked: boolean; remainingMs: number } {
  const record = loginAttempts.get(identifier);
  if (!record) return { locked: false, remainingMs: 0 };
  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    return { locked: true, remainingMs: record.lockedUntil - Date.now() };
  }
  if (record.lockedUntil && Date.now() >= record.lockedUntil) {
    loginAttempts.delete(identifier);
    return { locked: false, remainingMs: 0 };
  }
  return { locked: false, remainingMs: 0 };
}

function recordFailedLogin(identifier: string): void {
  const record = loginAttempts.get(identifier) || { count: 0, lockedUntil: null };
  record.count += 1;
  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
  }
  loginAttempts.set(identifier, record);
}

function clearFailedLogins(identifier: string): void {
  loginAttempts.delete(identifier);
}

function safeError(_error: any): string {
  return "Erro interno do servidor";
}

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUUID(id: string): boolean {
  return uuidRegex.test(id);
}

const VALID_CLIENT_STATUSES = ["em_analise", "em_contacto", "pagamento_feito", "reprovado"] as const;
const VALID_WITHDRAWAL_STATUSES = ["pendente", "processando", "pago", "recusado"] as const;
const VALID_WITHDRAWAL_METHODS = ["Transferência IBAN", "Unitel Money", "Afrimoney"] as const;
const ALLOWED_SETTINGS_KEYS = [
  "commission_essencial", "commission_profissional", "commission_premium",
  "price_essencial", "price_profissional", "price_premium",
  "min_withdrawal", "platform_name", "support_email", "support_phone",
] as const;

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Não autenticado" });
  }
  next();
}

async function requireActiveUser(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Não autenticado" });
  }
  const user = await storage.getUser(req.session.userId);
  if (!user || !user.isActive) {
    req.session.destroy(() => {});
    return res.status(403).json({ message: "Conta desativada" });
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId || req.session?.userRole !== "admin") {
    return res.status(403).json({ message: "Acesso negado" });
  }
  next();
}

declare module "express-session" {
  interface SessionData {
    userId: string;
    userRole: string;
    csrfToken: string;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.set("trust proxy", 1);

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  app.use(hpp());

  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Demasiados pedidos. Tente novamente mais tarde." },
    keyGenerator: (req) => getClientIp(req),
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Demasiadas tentativas de autenticação. Tente novamente em 15 minutos." },
    keyGenerator: (req) => getClientIp(req),
  });

  const strictLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Operação limitada. Aguarde um momento." },
    keyGenerator: (req) => getClientIp(req),
  });

  app.use("/api/", generalLimiter);

  const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(64).toString("hex");

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      name: "__sid",
      store: new SessionStore({ checkPeriod: 86400000 }),
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      },
    })
  );

  app.use("/api/", (req: Request, res: Response, next: NextFunction) => {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();

    const csrfExemptPaths = ["/auth/login", "/auth/register"];
    if (csrfExemptPaths.some(p => req.path === p || req.path === `/api${p}`)) {
      return next();
    }

    if (!req.session?.csrfToken) {
      req.session.csrfToken = crypto.randomBytes(32).toString("hex");
    }

    const csrfHeader = req.headers["x-csrf-token"] as string;
    if (!csrfHeader || csrfHeader !== req.session.csrfToken) {
      return res.status(403).json({ message: "Token CSRF inválido" });
    }
    next();
  });

  app.get("/api/auth/csrf-token", (req: Request, res: Response) => {
    if (!req.session.csrfToken) {
      req.session.csrfToken = crypto.randomBytes(32).toString("hex");
    }
    res.json({ token: req.session.csrfToken });
  });

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
  app.post("/api/auth/register", authLimiter, async (req: Request, res: Response) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Dados inválidos" });

      if (parsed.data.password.length < 8) {
        return res.status(400).json({ message: "A senha deve ter no mínimo 8 caracteres" });
      }
      if (!/[A-Z]/.test(parsed.data.password)) {
        return res.status(400).json({ message: "A senha deve conter pelo menos uma letra maiúscula" });
      }
      if (!/[0-9]/.test(parsed.data.password)) {
        return res.status(400).json({ message: "A senha deve conter pelo menos um número" });
      }

      const sanitizedName = sanitizeString(parsed.data.name.trim());
      const sanitizedPhone = parsed.data.phone.replace(/[^\d+\s()-]/g, "").trim();

      if (sanitizedName.length < 2 || sanitizedName.length > 100) {
        return res.status(400).json({ message: "Nome inválido" });
      }

      if (parsed.data.role && parsed.data.role !== "user") {
        return res.status(403).json({ message: "Operação não permitida" });
      }

      const existing = await storage.getUserByPhone(sanitizedPhone);
      if (existing) return res.status(409).json({ message: "Este número já está cadastrado" });

      const hashedPassword = await bcrypt.hash(parsed.data.password, 12);
      const user = await storage.createUser({ ...parsed.data, name: sanitizedName, phone: sanitizedPhone, password: hashedPassword, role: "user" });

      await storage.createSecurityLog({
        action: "Novo Registo",
        userId: user.id,
        userLabel: sanitizedName,
        ip: getClientIp(req),
        status: "success",
      });

      res.status(201).json({ message: "Conta criada com sucesso", user: { id: user.id, name: user.name, role: user.role } });
    } catch (error: any) {
      console.error("Register error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  app.post("/api/auth/login", authLimiter, async (req: Request, res: Response) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Dados inválidos" });

      const clientIp = getClientIp(req);
      const lockKey = `${parsed.data.phone}_${clientIp}`;

      const lockStatus = checkAccountLock(lockKey);
      if (lockStatus.locked) {
        const minutesRemaining = Math.ceil(lockStatus.remainingMs / 60000);
        await storage.createSecurityLog({
          action: "Login Bloqueado (Conta Trancada)",
          userLabel: parsed.data.phone,
          ip: clientIp,
          status: "error",
        });
        return res.status(429).json({
          message: `Conta temporariamente bloqueada. Tente novamente em ${minutesRemaining} minutos.`,
        });
      }

      const user = await storage.getUserByPhone(parsed.data.phone);
      if (!user) {
        recordFailedLogin(lockKey);
        await storage.createSecurityLog({
          action: "Tentativa de Login Falhou",
          userLabel: parsed.data.phone,
          ip: clientIp,
          status: "error",
        });
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      if (!user.isActive) {
        await storage.createSecurityLog({
          action: "Login Recusado (Conta Desativada)",
          userId: user.id,
          userLabel: user.name,
          ip: clientIp,
          status: "error",
        });
        return res.status(403).json({ message: "Conta desativada. Contacte o suporte." });
      }

      const valid = await bcrypt.compare(parsed.data.password, user.password);
      if (!valid) {
        recordFailedLogin(lockKey);
        const record = loginAttempts.get(lockKey);
        const remaining = MAX_LOGIN_ATTEMPTS - (record?.count || 0);

        await storage.createSecurityLog({
          action: `Tentativa de Login Falhou (${remaining > 0 ? remaining + " tentativas restantes" : "conta bloqueada"})`,
          userId: user.id,
          userLabel: user.name,
          ip: clientIp,
          status: "error",
        });
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      clearFailedLogins(lockKey);

      req.session.regenerate((err) => {
        if (err) {
          console.error("Session regeneration error:", err);
          return res.status(500).json({ message: safeError(err) });
        }

        req.session.userId = user.id;
        req.session.userRole = user.role;
        req.session.csrfToken = crypto.randomBytes(32).toString("hex");

        storage.createSecurityLog({
          action: "Login Bem-Sucedido",
          userId: user.id,
          userLabel: user.name,
          ip: clientIp,
          status: "success",
        });

        res.json({
          user: { id: user.id, name: user.name, role: user.role, phone: user.phone },
          csrfToken: req.session.csrfToken,
        });
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const userId = req.session?.userId;
    const clientIp = getClientIp(req);
    req.session.destroy(() => {
      res.clearCookie("__sid");
      if (userId) {
        storage.createSecurityLog({
          action: "Logout",
          userId,
          userLabel: "Utilizador",
          ip: clientIp,
          status: "success",
        });
      }
      res.json({ message: "Sessão encerrada" });
    });
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    if (!req.session?.userId) return res.status(401).json({ message: "Não autenticado" });
    const user = await storage.getUser(req.session.userId);
    if (!user) return res.status(401).json({ message: "Utilizador não encontrado" });
    if (!user.isActive) {
      req.session.destroy(() => {});
      return res.status(403).json({ message: "Conta desativada" });
    }
    res.json({
      id: user.id,
      name: user.name,
      role: user.role,
      phone: user.phone,
      iban: user.iban,
      multicaixaExpress: user.multicaixaExpress,
      referralCode: user.referralCode,
      isActive: user.isActive,
      createdAt: user.createdAt,
    });
  });

  // === ADMIN: DASHBOARD ===
  app.get("/api/admin/dashboard", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error: any) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  // === ADMIN: AFFILIATES ===
  app.get("/api/admin/affiliates", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const affiliates = await storage.getAffiliates();
      res.json(affiliates.map(a => ({
        id: a.id,
        name: a.name,
        phone: a.phone,
        isActive: a.isActive,
        createdAt: a.createdAt,
        referralCode: a.referralCode,
      })));
    } catch (error: any) {
      console.error("Affiliates error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  app.patch("/api/admin/affiliates/:id/toggle", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!isValidUUID(id)) return res.status(400).json({ message: "ID inválido" });

      const user = await storage.getUser(id);
      if (!user || user.role === "admin") return res.status(404).json({ message: "Afiliado não encontrado" });

      const updated = await storage.toggleUserActive(id, !user.isActive);
      if (!updated) return res.status(404).json({ message: "Afiliado não encontrado" });

      await storage.createSecurityLog({
        action: `Afiliado ${updated.isActive ? "Ativado" : "Desativado"}: ${updated.name}`,
        userId: req.session.userId,
        userLabel: "Admin",
        ip: getClientIp(req),
        status: "warning",
      });

      res.json({ id: updated.id, name: updated.name, isActive: updated.isActive });
    } catch (error: any) {
      console.error("Toggle affiliate error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  // === ADMIN: CLIENTS ===
  app.get("/api/admin/clients", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const allClients = await storage.getClients();
      res.json(allClients);
    } catch (error: any) {
      console.error("Clients error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  app.patch("/api/admin/clients/:id/status", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!isValidUUID(id)) return res.status(400).json({ message: "ID inválido" });

      const { status } = req.body;
      if (!VALID_CLIENT_STATUSES.includes(status)) {
        return res.status(400).json({ message: "Status inválido" });
      }

      const updated = await storage.updateClientStatus(id, status);
      if (!updated) return res.status(404).json({ message: "Cliente não encontrado" });

      await storage.createSecurityLog({
        action: `Status de Cliente Alterado para ${status}`,
        userId: req.session.userId,
        userLabel: "Admin",
        ip: getClientIp(req),
        status: "warning",
      });

      res.json(updated);
    } catch (error: any) {
      console.error("Client status error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  // === ADMIN: WITHDRAWALS ===
  app.get("/api/admin/withdrawals", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const allWithdrawals = await storage.getWithdrawals();
      res.json(allWithdrawals);
    } catch (error: any) {
      console.error("Withdrawals error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  app.get("/api/admin/withdrawals/stats", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const stats = await storage.getWithdrawalStats();
      res.json(stats);
    } catch (error: any) {
      console.error("Withdrawal stats error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  app.patch("/api/admin/withdrawals/:id/status", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!isValidUUID(id)) return res.status(400).json({ message: "ID inválido" });

      const { status } = req.body;
      if (!VALID_WITHDRAWAL_STATUSES.includes(status)) {
        return res.status(400).json({ message: "Status inválido" });
      }

      const updated = await storage.updateWithdrawalStatus(id, status);
      if (!updated) return res.status(404).json({ message: "Saque não encontrado" });

      await storage.createSecurityLog({
        action: `Saque ${status === 'pago' ? 'Aprovado' : status === 'recusado' ? 'Recusado' : 'Atualizado'}`,
        userId: req.session.userId,
        userLabel: "Admin",
        ip: getClientIp(req),
        status: status === 'recusado' ? 'error' : 'success',
      });

      res.json(updated);
    } catch (error: any) {
      console.error("Withdrawal status error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  // === ADMIN: MATERIALS ===
  app.get("/api/admin/materials", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const mats = await storage.getMaterials();
      res.json(mats);
    } catch (error: any) {
      console.error("Materials error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  app.post("/api/admin/materials", requireAdmin, async (req: Request, res: Response) => {
    try {
      const parsed = insertMaterialSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Dados inválidos" });

      const sanitized = sanitizeObject(parsed.data as Record<string, any>);
      const material = await storage.createMaterial(sanitized as any);
      res.status(201).json(material);
    } catch (error: any) {
      console.error("Create material error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  app.delete("/api/admin/materials/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!isValidUUID(id)) return res.status(400).json({ message: "ID inválido" });

      await storage.deleteMaterial(id);
      res.json({ message: "Material removido" });
    } catch (error: any) {
      console.error("Delete material error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  // === ADMIN: NOTIFICATIONS ===
  app.get("/api/admin/notifications", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const notifs = await storage.getNotifications();
      res.json(notifs);
    } catch (error: any) {
      console.error("Notifications error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  app.post("/api/admin/notifications", requireAdmin, async (req: Request, res: Response) => {
    try {
      const parsed = insertNotificationSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Dados inválidos" });

      const sanitized = sanitizeObject(parsed.data as Record<string, any>);
      const notif = await storage.createNotification(sanitized as any);
      res.status(201).json(notif);
    } catch (error: any) {
      console.error("Create notification error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  // === ADMIN: SECURITY LOGS ===
  app.get("/api/admin/security-logs", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const logs = await storage.getSecurityLogs();
      res.json(logs);
    } catch (error: any) {
      console.error("Security logs error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  // === ADMIN: SETTINGS ===
  app.get("/api/admin/settings", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const allSettings = await storage.getAllSettings();
      const settingsMap: Record<string, string> = {};
      for (const s of allSettings) {
        settingsMap[s.key] = s.value;
      }
      res.json(settingsMap);
    } catch (error: any) {
      console.error("Settings error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  app.patch("/api/admin/settings", requireAdmin, async (req: Request, res: Response) => {
    try {
      const updates = req.body as Record<string, string>;

      for (const key of Object.keys(updates)) {
        if (!ALLOWED_SETTINGS_KEYS.includes(key as any)) {
          return res.status(400).json({ message: `Chave de configuração não permitida: ${sanitizeString(key)}` });
        }
        if (typeof updates[key] !== "string" || updates[key].length > 500) {
          return res.status(400).json({ message: "Valor de configuração inválido" });
        }
      }

      for (const [key, value] of Object.entries(updates)) {
        await storage.setSetting(key, sanitizeString(value));
      }

      await storage.createSecurityLog({
        action: "Configurações Atualizadas",
        userId: req.session.userId,
        userLabel: "Admin",
        ip: getClientIp(req),
        status: "warning",
      });

      res.json({ message: "Configurações salvas" });
    } catch (error: any) {
      console.error("Update settings error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  // === USER: CLIENTS ===
  app.get("/api/user/clients", requireActiveUser, async (req: Request, res: Response) => {
    try {
      const userClients = await storage.getClientsByAffiliate(req.session.userId!);
      res.json(userClients);
    } catch (error: any) {
      console.error("User clients error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  app.post("/api/user/clients", requireActiveUser, strictLimiter, async (req: Request, res: Response) => {
    try {
      const data = { ...req.body, affiliateId: req.session.userId! };
      const parsed = insertClientSchema.safeParse(data);
      if (!parsed.success) return res.status(400).json({ message: "Dados inválidos" });

      const sanitizedData = {
        ...parsed.data,
        name: sanitizeString(parsed.data.name.trim()),
        contact: parsed.data.contact.replace(/[^\d+\s()@.\w-]/g, "").trim(),
      };

      if (sanitizedData.name.length < 2 || sanitizedData.name.length > 200) {
        return res.status(400).json({ message: "Nome do cliente inválido" });
      }

      const client = await storage.createClient(sanitizedData);
      res.status(201).json(client);
    } catch (error: any) {
      console.error("Create client error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  // === USER: WITHDRAWALS ===
  app.get("/api/user/withdrawals", requireActiveUser, async (req: Request, res: Response) => {
    try {
      const userWithdrawals = await storage.getWithdrawalsByAffiliate(req.session.userId!);
      res.json(userWithdrawals);
    } catch (error: any) {
      console.error("User withdrawals error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  app.post("/api/user/withdrawals", requireActiveUser, strictLimiter, async (req: Request, res: Response) => {
    try {
      const data = { ...req.body, affiliateId: req.session.userId! };
      const parsed = insertWithdrawalSchema.safeParse(data);
      if (!parsed.success) return res.status(400).json({ message: "Dados inválidos" });

      const amount = parseFloat(parsed.data.amount);
      if (isNaN(amount) || amount <= 0 || amount > 10000000) {
        return res.status(400).json({ message: "Valor de saque inválido" });
      }

      if (parsed.data.method && !VALID_WITHDRAWAL_METHODS.includes(parsed.data.method as any)) {
        return res.status(400).json({ message: "Método de pagamento inválido" });
      }

      const sanitizedData = {
        ...parsed.data,
        accountInfo: parsed.data.accountInfo ? sanitizeString(parsed.data.accountInfo.trim()) : undefined,
      };

      const userClients = await storage.getClientsByAffiliate(req.session.userId!);
      const totalCommission = userClients
        .filter(c => c.status === "pagamento_feito")
        .reduce((sum, c) => sum + parseFloat(c.commission), 0);

      const userWithdrawals = await storage.getWithdrawalsByAffiliate(req.session.userId!);
      const totalWithdrawn = userWithdrawals
        .filter(w => w.status !== "recusado")
        .reduce((sum, w) => sum + parseFloat(w.amount), 0);

      const availableBalance = totalCommission - totalWithdrawn;

      if (amount > availableBalance) {
        return res.status(400).json({ message: "Saldo insuficiente para este saque" });
      }

      const withdrawal = await storage.createWithdrawal(sanitizedData);
      res.status(201).json(withdrawal);
    } catch (error: any) {
      console.error("Create withdrawal error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  // === USER: NOTIFICATIONS ===
  app.get("/api/user/notifications", requireActiveUser, async (req: Request, res: Response) => {
    try {
      const notifs = await storage.getNotifications("user", req.session.userId!);
      res.json(notifs);
    } catch (error: any) {
      console.error("User notifications error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  // === USER: MATERIALS ===
  app.get("/api/user/materials", requireActiveUser, async (_req: Request, res: Response) => {
    try {
      const mats = await storage.getMaterials();
      res.json(mats);
    } catch (error: any) {
      console.error("User materials error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  // === USER: PROFILE UPDATE ===
  app.patch("/api/user/profile", requireActiveUser, async (req: Request, res: Response) => {
    try {
      const parsed = updateProfileSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Dados inválidos" });

      const sanitizedData: Record<string, any> = {};
      if (parsed.data.iban !== undefined) {
        const ibanClean = parsed.data.iban ? parsed.data.iban.replace(/[^A-Z0-9]/gi, "").toUpperCase() : null;
        if (ibanClean && (ibanClean.length < 15 || ibanClean.length > 34)) {
          return res.status(400).json({ message: "IBAN inválido" });
        }
        sanitizedData.iban = ibanClean;
      }
      if (parsed.data.multicaixaExpress !== undefined) {
        const mcClean = parsed.data.multicaixaExpress ? parsed.data.multicaixaExpress.replace(/[^\d+\s()-]/g, "").trim() : null;
        sanitizedData.multicaixaExpress = mcClean;
      }

      const updated = await storage.updateUserProfile(req.session.userId!, sanitizedData);
      if (!updated) return res.status(404).json({ message: "Utilizador não encontrado" });
      res.json({ id: updated.id, name: updated.name, phone: updated.phone, iban: updated.iban, multicaixaExpress: updated.multicaixaExpress });
    } catch (error: any) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  // === USER: CHANGE PASSWORD ===
  app.post("/api/user/change-password", requireActiveUser, strictLimiter, async (req: Request, res: Response) => {
    try {
      const parsed = changePasswordSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Dados inválidos" });

      if (parsed.data.newPassword.length < 8) {
        return res.status(400).json({ message: "A nova senha deve ter no mínimo 8 caracteres" });
      }
      if (!/[A-Z]/.test(parsed.data.newPassword)) {
        return res.status(400).json({ message: "A nova senha deve conter pelo menos uma letra maiúscula" });
      }
      if (!/[0-9]/.test(parsed.data.newPassword)) {
        return res.status(400).json({ message: "A nova senha deve conter pelo menos um número" });
      }

      const user = await storage.getUser(req.session.userId!);
      if (!user) return res.status(404).json({ message: "Utilizador não encontrado" });

      const valid = await bcrypt.compare(parsed.data.currentPassword, user.password);
      if (!valid) return res.status(401).json({ message: "Senha atual incorreta" });

      if (parsed.data.currentPassword === parsed.data.newPassword) {
        return res.status(400).json({ message: "A nova senha deve ser diferente da atual" });
      }

      const hashedPassword = await bcrypt.hash(parsed.data.newPassword, 12);
      await storage.updateUserPassword(req.session.userId!, hashedPassword);

      await storage.createSecurityLog({
        action: "Senha Alterada",
        userId: user.id,
        userLabel: user.name,
        ip: getClientIp(req),
        status: "warning",
      });

      res.json({ message: "Senha atualizada com sucesso" });
    } catch (error: any) {
      console.error("Change password error:", error);
      res.status(500).json({ message: safeError(error) });
    }
  });

  return httpServer;
}
