import type { Bot } from "grammy";

import type { BotContext } from "../../types/context.js";

export function registerStartCommand(bot: Bot<BotContext>): void {
  bot.command("start", async (ctx) => {
    console.log("START COMMAND HIT");

    await ctx.reply(
      "👋 Assalomu alaykum!\n\nMen AI yordamchiman. Savolingizni yozing, imkon qadar tezroq javob beraman.",
    );

    console.log("REPLY SENT");
  });
}
