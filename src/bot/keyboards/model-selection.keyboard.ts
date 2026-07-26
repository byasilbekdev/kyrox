import { InlineKeyboard } from "grammy";

export const AVAILABLE_MODELS = [
  { label: "Gemini 2.5 Flash", value: "google/gemini-2.5-flash" },
  { label: "DeepSeek V3", value: "deepseek/deepseek-chat" },
  { label: "Qwen 2.5 72B", value: "qwen/qwen-2.5-72b-instruct" },
  { label: "Mistral Large", value: "mistralai/mistral-large" },
  { label: "GPT-4o Mini", value: "openai/gpt-4o-mini" },
  { label: "Claude 3.5 Sonnet", value: "anthropic/claude-3.5-sonnet" },
] as const;

export function buildModelSelectionKeyboard(): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  for (const model of AVAILABLE_MODELS) {
    keyboard.text(model.label, `admin:set_model:${model.value}`).row();
  }

  return keyboard.text("⬅️ Orqaga", "admin:back_to_menu");
}
