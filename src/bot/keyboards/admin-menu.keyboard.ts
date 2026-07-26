import { InlineKeyboard } from "grammy";

export const ADMIN_CALLBACKS = {
  TOGGLE_AI: "admin:toggle_ai",
  EDIT_PROMPT: "admin:edit_prompt",
  EDIT_MODEL: "admin:edit_model",
  EDIT_TEMPERATURE: "admin:edit_temperature",
  EDIT_MAX_TOKENS: "admin:edit_max_tokens",
  STATISTICS: "admin:statistics",
  BROADCAST: "admin:broadcast",
  EXPORT_CONVERSATIONS: "admin:export_conversations",
  IMPORT_PROMPT: "admin:import_prompt",
  MAINTENANCE_TOGGLE: "admin:maintenance_toggle",
  CHANNELS: "admin:channels",
  OWNER_SETTINGS: "admin:owner_settings",
  BACK_TO_MENU: "admin:back_to_menu",
} as const;

export function buildAdminMenuKeyboard(aiEnabled: boolean, maintenanceMode: boolean): InlineKeyboard {
  return new InlineKeyboard()
    .text(aiEnabled ? "🟢 AI: Yoqilgan" : "🔴 AI: O'chirilgan", ADMIN_CALLBACKS.TOGGLE_AI)
    .row()
    .text("📝 Promptni tahrirlash", ADMIN_CALLBACKS.EDIT_PROMPT)
    .row()
    .text("🤖 Modelni o'zgartirish", ADMIN_CALLBACKS.EDIT_MODEL)
    .row()
    .text("🌡 Temperature", ADMIN_CALLBACKS.EDIT_TEMPERATURE)
    .text("🔢 Max Tokens", ADMIN_CALLBACKS.EDIT_MAX_TOKENS)
    .row()
    .text("📊 Statistika", ADMIN_CALLBACKS.STATISTICS)
    .row()
    .text("📢 Broadcast", ADMIN_CALLBACKS.BROADCAST)
    .row()
    .text("📤 Suhbatlarni eksport qilish", ADMIN_CALLBACKS.EXPORT_CONVERSATIONS)
    .row()
    .text("📥 Promptni import qilish", ADMIN_CALLBACKS.IMPORT_PROMPT)
    .row()
    .text(
      maintenanceMode ? "🛠 Texnik xizmat: Yoqilgan" : "✅ Texnik xizmat: O'chirilgan",
      ADMIN_CALLBACKS.MAINTENANCE_TOGGLE
    )
    .row()
    .text("📡 Kanallar", ADMIN_CALLBACKS.CHANNELS)
    .text("⚙️ Sozlamalar", ADMIN_CALLBACKS.OWNER_SETTINGS);
}

export function buildBackKeyboard(): InlineKeyboard {
  return new InlineKeyboard().text("⬅️ Orqaga", ADMIN_CALLBACKS.BACK_TO_MENU);
}
