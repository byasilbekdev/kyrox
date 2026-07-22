import "dotenv/config";

export const env = {
  BOT_TOKEN: process.env.BOT_TOKEN!,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
};

if (!env.BOT_TOKEN) {
  throw new Error("BOT_TOKEN is missing");
}

if (!env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing");
}
