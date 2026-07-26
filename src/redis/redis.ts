import { Redis } from "@upstash/redis";

import { env } from "../config/env.js";

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export const CACHE_TTL = {
  PROMPT_SECONDS: 300,
  SETTINGS_SECONDS: 300,
  OWNER_SECONDS: 300,
  AI_RESPONSE_SECONDS: 600,
} as const;

export function cacheKey(...parts: (string | number | bigint)[]): string {
  return parts.map(String).join(":");
}

export async function getCached<T>(key: string): Promise<T | null> {
  const value = await redis.get<T>(key);
  return value ?? null;
}

export async function setCached<T>(
  key: string,
  value: T,
  ttlSeconds: number
): Promise<void> {
  await redis.set(key, value, { ex: ttlSeconds });
}

export async function invalidateCache(key: string): Promise<void> {
  await redis.del(key);
}
