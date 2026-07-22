import { Bot } from "grammy";
import { generateReply } from "../services/ai.service.js";

const PREMIUM_STATUS_EMOJI =
  '<tg-emoji emoji-id="5368324170671202286">🤖</tg-emoji>';

export function registerBusinessHandler(bot: Bot): void {
  bot.on("business_message", async (ctx) => {
    const { text, business_connection_id } = ctx.businessMessage;

    if (!text) return;

    try {
      const reply = await generateReply(text);

      await ctx.reply(
        `${reply}\n\n<i>${PREMIUM_STATUS_EMOJI} Auto-reply by AI Assistant</i>`,
        {
          business_connection_id,
          parse_mode: "HTML",
        },
      );
    } catch (error) {
      console.error(error);

      await ctx.reply("⚠️ Kechirasiz, hozircha javob bera olmadim.", {
        business_connection_id,
      });
    }
  });
}
