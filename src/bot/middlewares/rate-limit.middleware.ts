import type { NextFunction } from "grammy";

import { checkRateLimit, messageRateLimiter } from "../../redis/rate-limit.js";
import type { BotContext } from "../../types/context.js";
import { RateLimitError } from "../../utils/errors.js";

export async function rateLimitMiddleware(ctx: BotContext, next: NextFunction): Promise<void> {
  const telegramId = ctx.from?.id;

  if (!telegramId) {
    await next();
    return;
  }

  const result = await checkRateLimit(messageRateLimiter, String(telegramId));

  if (!result.success) {
    throw new RateLimitError("Rate limit exceeded", { telegramId });
  }

  await next();
}
