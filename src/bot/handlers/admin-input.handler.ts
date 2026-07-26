import type { Bot } from "grammy";

import { adminLogRepository } from "../../features/admin/admin-log.repository.js";
import { broadcastService } from "../../features/admin/broadcast.service.js";
import { promptService } from "../../features/prompt/index.js";
import { settingsService } from "../../features/settings/index.js";
import type { BotContext } from "../../types/context.js";
import { ValidationError } from "../../utils/errors.js";
import { requireOwner } from "../middlewares/owner.middleware.js";

export function registerAdminInputHandler(bot: Bot<BotContext>): void {
  bot.on("message:text", requireOwner, async (ctx, next) => {
    const step = ctx.session.pendingAdminStep;

    if (!step) {
      await next();
      return;
    }

    const ownerId = ctx.ownerId!;
    const text = ctx.message.text.trim();

    try {
      switch (step) {
        case "AWAITING_PROMPT": {
          await promptService.updateSystemPrompt(ownerId, text);
          await adminLogRepository.record(ownerId, "PROMPT_UPDATED", {});
          await ctx.reply("✅ Prompt yangilandi.");
          break;
        }

        case "AWAITING_IMPORT_PROMPT": {
          await promptService.updateSystemPrompt(ownerId, text);
          await adminLogRepository.record(ownerId, "PROMPT_IMPORTED", {});
          await ctx.reply("✅ Prompt import qilindi.");
          break;
        }

        case "AWAITING_TEMPERATURE": {
          const value = Number.parseFloat(text);
          if (Number.isNaN(value)) {
            throw new ValidationError("Raqam kiriting, masalan: 0.7");
          }
          await settingsService.updateSettings(ownerId, { temperature: value });
          await adminLogRepository.record(ownerId, "TEMPERATURE_UPDATED", { value });
          await ctx.reply(`✅ Temperature ${value} ga o'rnatildi.`);
          break;
        }

        case "AWAITING_MAX_TOKENS": {
          const value = Number.parseInt(text, 10);
          if (Number.isNaN(value)) {
            throw new ValidationError("Butun son kiriting, masalan: 1000");
          }
          await settingsService.updateSettings(ownerId, { maxTokens: value });
          await adminLogRepository.record(ownerId, "MAX_TOKENS_UPDATED", { value });
          await ctx.reply(`✅ Max tokens ${value} ga o'rnatildi.`);
          break;
        }

        case "AWAITING_BROADCAST_MESSAGE": {
          await ctx.reply("📢 Yuborilmoqda...");
          const result = await broadcastService.broadcastToVisitors(ctx.api, ownerId, text);
          await adminLogRepository.record(ownerId, "BROADCAST_SENT", result);
          await ctx.reply(`✅ Yuborildi: ${result.sent} ta, xato: ${result.failed} ta.`);
          break;
        }

        case "AWAITING_CHANNEL_ID": {
          // Handled by channel handler; kept here only to satisfy exhaustiveness.
          break;
        }
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        await ctx.reply(`⚠️ ${error.message}`);
        return; // keep the pending step active so the owner can retry
      }
      throw error;
    }

    ctx.session.pendingAdminStep = undefined;
  });
}
