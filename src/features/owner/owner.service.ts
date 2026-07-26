import { env } from "../../config/env.js";
import { CACHE_TTL, cacheKey, getCached, invalidateCache, setCached } from "../../redis/redis.js";
import { userRepository } from "../user/index.js";
import { logger } from "../../utils/logger.js";
import { ownerRepository } from "./owner.repository.js";

const DEFAULT_SYSTEM_PROMPT =
  "Siz do'stona va foydali AI yordamchisiz. Foydalanuvchi savollariga qisqa, aniq va samimiy javob bering.";

export const ownerService = {
  async getByTelegramId(telegramId: bigint) {
    const key = cacheKey("owner", telegramId.toString());
    const cached = await getCached<{ id: string; maintenanceMode: boolean; isActive: boolean }>(key);
    if (cached) return cached;

    const owner = await ownerRepository.findByTelegramId(telegramId);
    if (!owner) return null;

    await setCached(key, owner, CACHE_TTL.OWNER_SECONDS);
    return owner;
  },

  async invalidateCache(telegramId: bigint) {
    await invalidateCache(cacheKey("owner", telegramId.toString()));
  },

  async bootstrapFirstOwner(): Promise<void> {
    const hasOwner = await ownerRepository.existsAny();
    if (hasOwner) return;

    const bootstrapUser = await userRepository.findByTelegramId(env.BOOTSTRAP_OWNER_TELEGRAM_ID);

    if (!bootstrapUser) {
      logger.warn("Bootstrap owner Telegram ID has not messaged the bot yet", {
        telegramId: env.BOOTSTRAP_OWNER_TELEGRAM_ID.toString(),
      });
      return;
    }

    await ownerRepository.create({
      userId: bootstrapUser.id,
      defaultPrompt: DEFAULT_SYSTEM_PROMPT,
      defaultAiModel: env.DEFAULT_AI_MODEL,
      defaultTemperature: env.DEFAULT_AI_TEMPERATURE,
      defaultMaxTokens: env.DEFAULT_AI_MAX_TOKENS,
    });

    logger.info("Bootstrap owner created", { userId: bootstrapUser.id });
  },

  async isOwner(telegramId: bigint): Promise<boolean> {
    const owner = await this.getByTelegramId(telegramId);
    return owner !== null;
  },
};
