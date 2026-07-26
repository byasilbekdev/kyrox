import express, { type Express } from "express";
import { webhookCallback } from "grammy";

import { env } from "../config/env.js";
import { bot } from "../bot/bot.js";
import { prisma } from "../database/prisma.js";
import { redis } from "../redis/redis.js";
import { logger } from "../utils/logger.js";

export function createServer(): Express {
  const app = express();

  app.use(express.json());

  app.get("/health", async (_req, res) => {
    const checks = { database: false, redis: false };

    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = true;
    } catch (error) {
      logger.error("Health check: database unreachable", {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    try {
      await redis.ping();
      checks.redis = true;
    } catch (error) {
      logger.error("Health check: redis unreachable", {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    const healthy = checks.database && checks.redis;
    res
      .status(healthy ? 200 : 503)
      .json({ status: healthy ? "ok" : "degraded", checks });
  });

  // Webhook path is not the bare bot token to avoid leaking it in
  // request logs / reverse-proxy access logs.
  app.post(
    "/webhook/kyrox",
    webhookCallback(bot, "express", {
      secretToken: env.WEBHOOK_SECRET,
    }),
  );

  return app;
}
