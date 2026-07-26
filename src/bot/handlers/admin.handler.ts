import { InputFile, type Bot } from "grammy";

import { adminLogRepository } from "../../features/admin/admin-log.repository.js";
import { statisticsService } from "../../features/admin/statistics.service.js";
import { channelService } from "../../features/channel/index.js";
import { conversationService } from "../../features/conversation/index.js";
import { ownerRepository, ownerService } from "../../features/owner/index.js";
import { settingsService } from "../../features/settings/index.js";
import type { BotContext } from "../../types/context.js";
import {
  ADMIN_CALLBACKS,
  buildAdminMenuKeyboard,
  buildBackKeyboard,
} from "../keyboards/admin-menu.keyboard.js";
import { buildModelSelectionKeyboard } from "../keyboards/model-selection.keyboard.js";
import { requireOwner } from "../middlewares/owner.middleware.js";

async function renderMenu(ctx: BotContext, ownerId: string): Promise<void> {
  const [owner, settings] = await Promise.all([
    ownerService.getByTelegramId(ctx.dbUser.telegramId),
    settingsService.getSettings(ownerId),
  ]);

  await ctx.editMessageText("🛠 KYROX boshqaruv paneli", {
    reply_markup: buildAdminMenuKeyboard(settings.aiEnabled, owner?.maintenanceMode ?? false),
  });
}

export function registerAdminHandlers(bot: Bot<BotContext>): void {
  bot.callbackQuery(ADMIN_CALLBACKS.TOGGLE_AI, requireOwner, async (ctx) => {
    const ownerId = ctx.ownerId!;
    const settings = await settingsService.getSettings(ownerId);

    await settingsService.toggleAi(ownerId, !settings.aiEnabled);
    await adminLogRepository.record(ownerId, "AI_TOGGLED", { enabled: !settings.aiEnabled });

    await ctx.answerCallbackQuery(!settings.aiEnabled ? "AI yoqildi" : "AI o'chirildi");
    await renderMenu(ctx, ownerId);
  });

  bot.callbackQuery(ADMIN_CALLBACKS.EDIT_PROMPT, requireOwner, async (ctx) => {
    ctx.session.pendingAdminStep = "AWAITING_PROMPT";
    await ctx.answerCallbackQuery();
    await ctx.editMessageText("📝 Yangi system promptni yuboring (10-4000 belgi):", {
      reply_markup: buildBackKeyboard(),
    });
  });

  bot.callbackQuery(ADMIN_CALLBACKS.EDIT_MODEL, requireOwner, async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText("🤖 Modelni tanlang:", {
      reply_markup: buildModelSelectionKeyboard(),
    });
  });

  bot.callbackQuery(/^admin:set_model:(.+)$/, requireOwner, async (ctx) => {
    const ownerId = ctx.ownerId!;
    const model = ctx.match![1]!;

    await settingsService.updateSettings(ownerId, { aiModel: model });
    await adminLogRepository.record(ownerId, "MODEL_UPDATED", { model });

    await ctx.answerCallbackQuery(`Model o'rnatildi: ${model}`);
    await renderMenu(ctx, ownerId);
  });

  bot.callbackQuery(ADMIN_CALLBACKS.EDIT_TEMPERATURE, requireOwner, async (ctx) => {
    ctx.session.pendingAdminStep = "AWAITING_TEMPERATURE";
    await ctx.answerCallbackQuery();
    await ctx.editMessageText("🌡 Yangi temperature qiymatini yuboring (0.0 - 2.0):", {
      reply_markup: buildBackKeyboard(),
    });
  });

  bot.callbackQuery(ADMIN_CALLBACKS.EDIT_MAX_TOKENS, requireOwner, async (ctx) => {
    ctx.session.pendingAdminStep = "AWAITING_MAX_TOKENS";
    await ctx.answerCallbackQuery();
    await ctx.editMessageText("🔢 Yangi max tokens qiymatini yuboring (50 - 4000):", {
      reply_markup: buildBackKeyboard(),
    });
  });

  bot.callbackQuery(ADMIN_CALLBACKS.STATISTICS, requireOwner, async (ctx) => {
    const ownerId = ctx.ownerId!;
    const stats = await statisticsService.getOwnerStatistics(ownerId);

    await ctx.answerCallbackQuery();
    await ctx.editMessageText(
      "📊 Statistika\n\n" +
        `Jami suhbatlar: ${stats.totalConversations}\n` +
        `Bugun faol: ${stats.activeToday}\n` +
        `Shu hafta faol: ${stats.activeThisWeek}\n` +
        `Jami xabarlar: ${stats.totalMessages}`,
      { reply_markup: buildBackKeyboard() }
    );
  });

  bot.callbackQuery(ADMIN_CALLBACKS.BROADCAST, requireOwner, async (ctx) => {
    ctx.session.pendingAdminStep = "AWAITING_BROADCAST_MESSAGE";
    await ctx.answerCallbackQuery();
    await ctx.editMessageText("📢 Barcha foydalanuvchilarga yuboriladigan xabarni yozing:", {
      reply_markup: buildBackKeyboard(),
    });
  });

  bot.callbackQuery(ADMIN_CALLBACKS.EXPORT_CONVERSATIONS, requireOwner, async (ctx) => {
    const ownerId = ctx.ownerId!;
    await ctx.answerCallbackQuery("Tayyorlanmoqda...");

    const conversations = await conversationService.exportConversationsForOwner(ownerId);
    const exportText = conversations
      .map((c: (typeof conversations)[number]) => {
        const lines = c.messages
          .map((m: (typeof c.messages)[number]) => `[${m.role}] ${m.content}`)
          .join("\n");
        return `=== Visitor: ${c.visitor.firstName} (${c.visitor.telegramId}) ===\n${lines}`;
      })
      .join("\n\n");

    const buffer = Buffer.from(exportText || "Suhbatlar topilmadi.", "utf-8");

    await ctx.replyWithDocument(new InputFile(buffer, "conversations-export.txt"), {
      caption: `📤 ${conversations.length} ta suhbat eksport qilindi`,
    });

    await adminLogRepository.record(ownerId, "CONVERSATION_EXPORTED", {
      count: conversations.length,
    });
  });

  bot.callbackQuery(ADMIN_CALLBACKS.IMPORT_PROMPT, requireOwner, async (ctx) => {
    ctx.session.pendingAdminStep = "AWAITING_IMPORT_PROMPT";
    await ctx.answerCallbackQuery();
    await ctx.editMessageText("📥 Import qilmoqchi bo'lgan promptni matn sifatida yuboring:", {
      reply_markup: buildBackKeyboard(),
    });
  });

  bot.callbackQuery(ADMIN_CALLBACKS.MAINTENANCE_TOGGLE, requireOwner, async (ctx) => {
    const ownerId = ctx.ownerId!;
    const owner = await ownerService.getByTelegramId(ctx.dbUser.telegramId);
    const next = !(owner?.maintenanceMode ?? false);

    await ownerRepository.setMaintenanceMode(ownerId, next);
    await ownerService.invalidateCache(ctx.dbUser.telegramId);
    await adminLogRepository.record(ownerId, "MAINTENANCE_TOGGLED", { enabled: next });

    await ctx.answerCallbackQuery(next ? "Texnik xizmat yoqildi" : "Texnik xizmat o'chirildi");
    await renderMenu(ctx, ownerId);
  });

  bot.callbackQuery(ADMIN_CALLBACKS.CHANNELS, requireOwner, async (ctx) => {
    const ownerId = ctx.ownerId!;
    const channels = await channelService.listForOwner(ownerId);

    const list = channels.length
      ? channels
          .map((c: (typeof channels)[number]) => `• ${c.title}${c.username ? ` (@${c.username})` : ""}`)
          .join("\n")
      : "Hozircha kanallar ulanmagan.";

    await ctx.answerCallbackQuery();
    await ctx.editMessageText(`📡 Ulangan kanallar:\n\n${list}`, {
      reply_markup: buildBackKeyboard(),
    });
  });

  bot.callbackQuery(ADMIN_CALLBACKS.OWNER_SETTINGS, requireOwner, async (ctx) => {
    const ownerId = ctx.ownerId!;
    const settings = await settingsService.getSettings(ownerId);

    await ctx.answerCallbackQuery();
    await ctx.editMessageText(
      "⚙️ Joriy sozlamalar:\n\n" +
        `Model: ${settings.aiModel}\n` +
        `Temperature: ${settings.temperature}\n` +
        `Max Tokens: ${settings.maxTokens}\n` +
        `Til: ${settings.language}`,
      { reply_markup: buildBackKeyboard() }
    );
  });

  bot.callbackQuery(ADMIN_CALLBACKS.BACK_TO_MENU, requireOwner, async (ctx) => {
    ctx.session.pendingAdminStep = undefined;
    await ctx.answerCallbackQuery();
    await renderMenu(ctx, ctx.ownerId!);
  });
}
