import type { Bot } from "grammy";

import { ownerService } from "../../features/owner/index.js";
import { settingsService } from "../../features/settings/index.js";
import type { BotContext } from "../../types/context.js";
import { requireOwner } from "../middlewares/owner.middleware.js";
import { buildAdminMenuKeyboard } from "../keyboards/admin-menu.keyboard.js";

export function registerAdminCommand(bot: Bot<BotContext>): void {
  bot.command("admin", requireOwner, async (ctx) => {
    const ownerId = ctx.ownerId!;

    const [owner, settings] = await Promise.all([
      ownerService.getByTelegramId(ctx.dbUser.telegramId),
      settingsService.getSettings(ownerId),
    ]);

    await ctx.reply("🛠 KYROX boshqaruv paneli", {
      reply_markup: buildAdminMenuKeyboard(settings.aiEnabled, owner?.maintenanceMode ?? false),
    });
  });
}
