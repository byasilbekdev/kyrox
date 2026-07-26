import { Ratelimit } from "@upstash/ratelimit";

import { env } from "../config/env.js";
import { redis } from "./redis.js";

const window = `${env.RATE_LIMIT_WINDOW_SECONDS} s` as const;

export const messageRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(env.RATE_LIMIT_MAX_REQUESTS, window),
  prefix: "ratelimit:message",
  analytics: false,
});

export const commandRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "60 s"),
  prefix: "ratelimit:command",
  analytics: false,
});

export const ownerBroadcastRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, "300 s"),
  prefix: "ratelimit:broadcast",
  analytics: false,
});

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAtMs: number;
}

export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string
): Promise<RateLimitResult> {
  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    resetAtMs: result.reset,
  };
}

const blockedKeyPrefix = "ratelimit:blocked";

export async function temporarilyBlock(
  identifier: string,
  seconds: number
): Promise<void> {
  await redis.set(`${blockedKeyPrefix}:${identifier}`, 1, { ex: seconds });
}

export async function isTemporarilyBlocked(identifier: string): Promise<boolean> {
  const value = await redis.get(`${blockedKeyPrefix}:${identifier}`);
  return value !== null;
}
