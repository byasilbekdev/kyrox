import type { Bot } from "grammy";

import { aiService } from "../../features/ai/index.js";
import { env } from "../../config/env.js";
import { ownerService } from "../../features/owner/index.js";
import type { BotContext } from "../../types/context.js";
import { logger } from "../../utils/logger.js";
import { rateLimitMiddleware } from "../middlewares/rate-limit.middleware.js";

export function registerMessageHandler(bot: Bot<BotContext>): void {
  bot.on("message:text", rateLimitMiddleware, async (ctx) => {
    if (ctx.message.text.startsWith("/")) return;

    const owner = await ownerService.getByTelegramId(env.BOOTSTRAP_OWNER_TELEGRAM_ID);

    if (!owner || !owner.isActive) {
      await ctx.reply("🤖 Bot hozircha sozlanmoqda. Birozdan so'ng qayta urinib ko'ring.");
      return;
    }

    if (owner.maintenanceMode) {
      await ctx.reply("🛠 Bot texnik ishlar tufayli vaqtincha ishlamayapti.");
      return;
    }

    await ctx.replyWithChatAction("typing");

    try {
      const result = await aiService.generateReply(owner.id, ctx.dbUser.id, ctx.message.text);

      if (!result) {
        await ctx.reply("🤖 AI hozircha o'chirilgan. Iltimos, keyinroq qayta urinib ko'ring.");
        return;
      }

      await ctx.reply(result.content);
    } catch (error) {
      logger.error("AI reply generation failed", {
        ownerId: owner.id,
        visitorId: ctx.dbUser.id,
        error: error instanceof Error ? error.message : String(error),
      });
      await ctx.reply("⚠️ Javob berishda xatolik yuz berdi. Birozdan so'ng qayta urinib ko'ring.");
    }
  });
}
