import { CACHE_TTL, cacheKey, getCached, invalidateCache, setCached } from "../../redis/redis.js";
import { ValidationError } from "../../utils/errors.js";
import { settingsRepository } from "./settings.repository.js";
import type { SettingsDto, UpdateSettingsInput } from "./settings.types.js";

const TEMPERATURE_MIN = 0;
const TEMPERATURE_MAX = 2;
const MAX_TOKENS_MIN = 50;
const MAX_TOKENS_MAX = 4000;

export const settingsService = {
  async getSettings(ownerId: string): Promise<SettingsDto> {
    const key = cacheKey("settings", ownerId);
    const cached = await getCached<SettingsDto>(key);
    if (cached) return cached;

    const settings = await settingsRepository.findByOwnerId(ownerId);

    if (!settings) {
      throw new ValidationError("Settings not found for owner", { ownerId });
    }

    const dto: SettingsDto = {
      aiEnabled: settings.aiEnabled,
      aiModel: settings.aiModel,
      temperature: settings.temperature,
      maxTokens: settings.maxTokens,
      language: settings.language,
    };

    await setCached(key, dto, CACHE_TTL.SETTINGS_SECONDS);
    return dto;
  },

  async updateSettings(ownerId: string, input: UpdateSettingsInput): Promise<void> {
    if (input.temperature !== undefined) {
      if (input.temperature < TEMPERATURE_MIN || input.temperature > TEMPERATURE_MAX) {
        throw new ValidationError(
          `Temperature must be between ${TEMPERATURE_MIN} and ${TEMPERATURE_MAX}`
        );
      }
    }

    if (input.maxTokens !== undefined) {
      if (input.maxTokens < MAX_TOKENS_MIN || input.maxTokens > MAX_TOKENS_MAX) {
        throw new ValidationError(
          `Max tokens must be between ${MAX_TOKENS_MIN} and ${MAX_TOKENS_MAX}`
        );
      }
    }

    if (input.aiModel !== undefined && input.aiModel.trim().length === 0) {
      throw new ValidationError("AI model cannot be empty");
    }

    await settingsRepository.update(ownerId, input);
    await invalidateCache(cacheKey("settings", ownerId));
  },

  async toggleAi(ownerId: string, enabled: boolean): Promise<void> {
    await this.updateSettings(ownerId, { aiEnabled: enabled });
  },
};
