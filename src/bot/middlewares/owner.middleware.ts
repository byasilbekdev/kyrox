import type { NextFunction } from "grammy";

import { ownerService } from "../../features/owner/index.js";
import type { BotContext } from "../../types/context.js";
import { UnauthorizedError } from "../../utils/errors.js";

export async function requireOwner(ctx: BotContext, next: NextFunction): Promise<void> {
  const telegramId = ctx.dbUser?.telegramId;

  if (!telegramId) {
    throw new UnauthorizedError("No authenticated user on context");
  }

  const owner = await ownerService.getByTelegramId(telegramId);

  if (!owner) {
    throw new UnauthorizedError("Not an owner", { telegramId: telegramId.toString() });
  }

  if (!owner.isActive) {
    throw new UnauthorizedError("Owner deactivated", { telegramId: telegramId.toString() });
  }

  ctx.ownerId = owner.id;

  await next();
}
