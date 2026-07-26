import type { BotError } from "grammy";

import type { BotContext } from "../../types/context.js";
import { isAppError } from "../../utils/errors.js";
import { logger } from "../../utils/logger.js";

export async function errorMiddleware(err: BotError<BotContext>): Promise<void> {
  const { ctx, error } = err;

  if (isAppError(error)) {
    logger.warn("Operational error", {
      code: error.code,
      message: error.message,
      context: error.context,
    });

    if (error.code === "RATE_LIMITED") {
      await ctx.reply("⏳ Juda ko'p so'rov yubordingiz. Birozdan so'ng qayta urinib ko'ring.");
      return;
    }

    if (error.code === "MAINTENANCE_MODE") {
      await ctx.reply("🛠 Bot texnik ishlar tufayli vaqtincha ishlamayapti.");
      return;
    }

    if (error.code === "UNAUTHORIZED") {
      return;
    }

    await ctx.reply("⚠️ Xatolik yuz berdi. Birozdan so'ng qayta urinib ko'ring.");
    return;
  }

  logger.error("Unexpected error", {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });

  try {
    await ctx.reply("⚠️ Kutilmagan xatolik yuz berdi. Administrator xabardor qilindi.");
  } catch {
    // Swallow — replying itself failed (e.g. blocked bot); nothing more we can do.
  }
}
