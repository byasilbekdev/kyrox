import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma = new PrismaClient({
  adapter,
  log:
    env.NODE_ENV === "development"
      ? [
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
      logger.warn("Slow query detected", {
        query: e.query,
        durationMs: e.duration,
      });
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
