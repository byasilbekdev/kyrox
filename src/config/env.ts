import "dotenv/config";

import { z } from "zod";

/**
 * Single source of truth for runtime configuration.
 *
 * The process must fail fast on boot if any required variable is
 * missing or malformed. We never want a misconfigured instance to
 * start accepting Telegram updates and fail midway through a request —
 * that produces silent data loss and confusing partial state.
 *
 * No other file in this codebase should read `process.env` directly.
 */
const envSchema = z.object({
  // ── App ────────────────────────────────────────────────
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

  // ── Telegram ───────────────────────────────────────────
  BOT_TOKEN: z.string().min(1, "BOT_TOKEN is required"),

  // Used once on bootstrap to auto-provision the first Owner row
  // if no Owner exists yet. Not a runtime authorization check —
  // ongoing authorization always goes through the Owner table.
  BOOTSTRAP_OWNER_TELEGRAM_ID: z.coerce.bigint(),

  // Empty / unset => long polling (local development).
  // Set (e.g. Render external URL) => webhook mode (production).
  WEBHOOK_URL: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),

  // Shared secret Telegram must echo back in the
  // `X-Telegram-Bot-Api-Secret-Token` header on webhook calls.
  WEBHOOK_SECRET: z.string().min(16).optional(),

  // ── Database ───────────────────────────────────────────
  DATABASE_URL: z.string().min(1),

  // ── Redis (Upstash REST) ────────────────────────────────
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

  // ── AI Providers ─────────────────────────────────────────
  OPENROUTER_API_KEY: z.string().min(1),
  GEMINI_API_KEY: z.string().min(1).optional(),
  GROQ_API_KEY: z.string().min(1).optional(),

  DEFAULT_AI_MODEL: z.string().default("google/gemini-2.5-flash"),
  DEFAULT_AI_TEMPERATURE: z.coerce.number().min(0).max(2).default(0.7),
  DEFAULT_AI_MAX_TOKENS: z.coerce.number().int().positive().default(1000),

  // ── Rate limiting ────────────────────────────────────────
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
