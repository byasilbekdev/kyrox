import type { StorageAdapter } from "grammy";

import { redis } from "../redis/redis.js";
import type { BotSessionData } from "../types/context.js";

const SESSION_TTL_SECONDS = 3600;
const SESSION_PREFIX = "session";

export const redisSessionStorage: StorageAdapter<BotSessionData> = {
  async read(key) {
    const value = await redis.get<BotSessionData>(`${SESSION_PREFIX}:${key}`);
    return value ?? undefined;
  },

  async write(key, value) {
    await redis.set(`${SESSION_PREFIX}:${key}`, value, { ex: SESSION_TTL_SECONDS });
  },

  async delete(key) {
    await redis.del(`${SESSION_PREFIX}:${key}`);
  },
};
