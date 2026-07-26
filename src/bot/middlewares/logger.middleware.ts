import type { NextFunction } from "grammy";

import type { BotContext } from "../../types/context.js";
import { logger } from "../../utils/logger.js";

function resolveUpdateType(ctx: BotContext): string {
  const keys = Object.keys(ctx.update).filter((k) => k !== "update_id");
  return keys[0] ?? "unknown";
}

export async function loggerMiddleware(ctx: BotContext, next: NextFunction): Promise<void> {
  const start = Date.now();
  const updateType = resolveUpdateType(ctx);
  const telegramId = ctx.from?.id;

  try {
    await next();
    logger.info("Update processed", {
      updateType,
      telegramId,
      durationMs: Date.now() - start,
    });
  } catch (error) {
    logger.error("Update processing failed", {
      updateType,
      telegramId,
      durationMs: Date.now() - start,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
