import type { Bot } from "grammy";

import type { BotContext } from "../../types/context.js";

export function registerHelpCommand(bot: Bot<BotContext>): void {
  bot.command("help", async (ctx) => {
    await ctx.reply(
      "ℹ️ Yordam\n\n" +
        "Menga istalgan savolingizni yozing — AI javob beradi.\n" +
        "Agar siz ushbu botning egasi bo'lsangiz, /admin buyrug'i orqali boshqaruv panelini oching."
    );
  });
}
