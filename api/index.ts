import type { VercelRequest, VercelResponse } from "@vercel/node";
import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";
import { seedAdmin } from "../server/seed";
import { runMigrations } from "../server/db";

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

const app = express();

app.use(
  express.json({
    limit: "1mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: false, limit: "1mb" }));

let initialized = false;

async function initialize() {
  if (initialized) return;
  try {
    //await runMigrations();
    await seedAdmin();
    const server = createServer(app);
    await registerRoutes(server, app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      console.error("Internal Server Error:", err);
      if (!res.headersSent) {
        res.status(status).json({ message: "Erro interno do servidor" });
      }
    });

    initialized = true;
  } catch (error) {
    console.error("Initialization error:", error);
    throw error;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initialize();
  return app(req as any, res as any);
}
