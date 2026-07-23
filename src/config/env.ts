import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),

  BOT_TOKEN: z.string().min(1, "BOT_TOKEN is required"),

  OWNER_TELEGRAM_ID: z.coerce.number(),

  DATABASE_URL: z.string().min(1),

  UPSTASH_REDIS_REST_URL: z.string().url(),

  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

  OPENROUTER_API_KEY: z.string().min(1),
  GEMINI_API_KEY: z.string().min(1),
  GROQ_API_KEY: z.string().min(1),

  AI_MODEL: z.string().default("google/gemini-2.5-flash"),

  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export const env = envSchema.parse(process.env);
