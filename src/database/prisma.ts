import { PrismaClient } from "../generated/prisma/index.js";

import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

export const prisma = new PrismaClient({
  log:
    env.NODE_ENV === "development"
      ? [
          { emit: "event", level: "query" },
          { emit: "stdout", level: "warn" },
          { emit: "stdout", level: "error" },
        ]
      : [
          { emit: "stdout", level: "warn" },
          { emit: "stdout", level: "error" },
        ],
});

if (env.NODE_ENV === "development") {
  prisma.$on("query" as never, (...args: unknown[]) => {
    const e = args[0] as { query: string; duration: number };
    if (e.duration > 200) {
      logger.warn("Slow query detected", { query: e.query, durationMs: e.duration });
    }
  });
}

export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
  logger.info("Database connected");
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  logger.info("Database disconnected");
}
