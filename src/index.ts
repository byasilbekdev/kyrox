import type { Server } from "node:http";

import { env } from "./config/env.js";
import { bot } from "./bot/bot.js";
import { connectDatabase, disconnectDatabase } from "./database/prisma.js";
import { ownerService } from "./features/owner/index.js";
import { createServer } from "./http/server.js";
import { logger } from "./utils/logger.js";

let httpServer: Server | undefined;

async function bootstrap(): Promise<void> {
  await connectDatabase();
  await ownerService.bootstrapFirstOwner();

  if (env.WEBHOOK_URL) {
    await startWebhookMode();
  } else {
    await startPollingMode();
  }
}

async function startWebhookMode(): Promise<void> {
  const app = createServer();

  await bot.api.setWebhook(`${env.WEBHOOK_URL}/webhook/kyrox`, {
    secret_token: env.WEBHOOK_SECRET,
  });

  httpServer = app.listen(env.PORT, () => {
    logger.info("HTTP server listening (webhook mode)", { port: env.PORT });
  });
}

async function startPollingMode(): Promise<void> {
  const app = createServer();
  httpServer = app.listen(env.PORT, () => {
    logger.info("HTTP server listening (polling mode)", { port: env.PORT });
  });

  await bot.api.deleteWebhook();
  logger.info("Bot starting in long-polling mode");
  await bot.start();
}

async function shutdown(signal: string): Promise<void> {
  logger.info("Shutdown signal received", { signal });

  try {
    if (env.WEBHOOK_URL) {
      await bot.api.deleteWebhook();
    } else {
      await bot.stop();
    }
  } catch (error) {
    logger.error("Error stopping bot", {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  await new Promise<void>((resolve) => {
    if (!httpServer) return resolve();
    httpServer.close(() => resolve());
  });

  await disconnectDatabase();

  logger.info("Shutdown complete");
  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection", {
    reason: reason instanceof Error ? reason.message : String(reason),
  });
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", { error: error.message, stack: error.stack });
  process.exit(1);
});

bootstrap().catch((error) => {
  logger.error("Bootstrap failed", {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});
