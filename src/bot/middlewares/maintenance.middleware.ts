import type { NextFunction } from "grammy";

import { env } from "../../config/env.js";
import { ownerService } from "../../features/owner/index.js";
import type { BotContext } from "../../types/context.js";
import { MaintenanceModeError } from "../../utils/errors.js";

export async function maintenanceMiddleware(ctx: BotContext, next: NextFunction): Promise<void> {
  const bootstrapOwnerTelegramId = env.BOOTSTRAP_OWNER_TELEGRAM_ID;
  const owner = await ownerService.getByTelegramId(bootstrapOwnerTelegramId);

  const isTheOwnerThemself = ctx.dbUser?.telegramId === bootstrapOwnerTelegramId;

  if (owner?.maintenanceMode && !isTheOwnerThemself) {
    throw new MaintenanceModeError("Bot is in maintenance mode");
  }

  await next();
}
