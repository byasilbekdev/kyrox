import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

  BOT_TOKEN: z.string().min(1, "BOT_TOKEN is required"),

  BOOTSTRAP_OWNER_TELEGRAM_ID: z.coerce.bigint(),

  WEBHOOK_URL: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),

  WEBHOOK_SECRET: z.string().min(16).optional(),

  DATABASE_URL: z.string().min(1),

  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

  OPENROUTER_API_KEY: z.string().min(1),
  GEMINI_API_KEY: z.string().min(1).optional(),
  GROQ_API_KEY: z.string().min(1).optional(),

  DEFAULT_AI_MODEL: z.string().default("google/gemini-2.5-flash"),
  DEFAULT_AI_TEMPERATURE: z.coerce.number().min(0).max(2).default(0.7),
  DEFAULT_AI_MAX_TOKENS: z.coerce.number().int().positive().default(1000),

  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(10),
  RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().positive().default(60),
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
    process.exit(1);
  }

  if (parsed.data.NODE_ENV === "production" && !parsed.data.WEBHOOK_URL) {
    console.error("❌ WEBHOOK_URL is required when NODE_ENV=production");
    process.exit(1);
  }

  return parsed.data;
}

export const env = loadEnv();
export type Env = typeof env;
