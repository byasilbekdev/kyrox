import { Bot } from "grammy";

import type { BotContext } from "../../types/context.js";

export function registerStartCommand(bot: Bot<BotContext>) {
  bot.command("start", async (ctx) => {
    await ctx.reply("👋 Assalomu alaykum!");
  });
}
