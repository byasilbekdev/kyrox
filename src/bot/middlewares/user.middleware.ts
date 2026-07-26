import type { NextFunction } from "grammy";

import { userService } from "../../features/user/index.js";
import type { BotContext } from "../../types/context.js";
import { logger } from "../../utils/logger.js";

export async function userMiddleware(ctx: BotContext, next: NextFunction): Promise<void> {
  const from = ctx.from;

  if (!from) {
    await next();
    return;
  }

  const dbUser = await userService.syncFromTelegram({
    telegramId: BigInt(from.id),
    username: from.username ?? null,
    firstName: from.first_name,
    lastName: from.last_name ?? null,
    languageCode: from.language_code ?? null,
    isPremium: from.is_premium ?? false,
    isBot: from.is_bot,
  });

  if (dbUser.isBlocked) {
    logger.warn("Blocked user attempted access", { telegramId: dbUser.telegramId.toString() });
    return;
  }

  ctx.dbUser = dbUser;

  await next();
}
