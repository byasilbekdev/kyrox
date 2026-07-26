import { CACHE_TTL, cacheKey, getCached, invalidateCache, setCached } from "../../redis/redis.js";
import { ValidationError } from "../../utils/errors.js";
import { promptRepository } from "./prompt.repository.js";

const MAX_PROMPT_LENGTH = 4000;
const MIN_PROMPT_LENGTH = 10;

export const promptService = {
  async getSystemPrompt(ownerId: string): Promise<string> {
    const key = cacheKey("prompt", ownerId);
    const cached = await getCached<string>(key);
    if (cached) return cached;

    const prompt = await promptRepository.findByOwnerId(ownerId);
    const systemPrompt = prompt?.systemPrompt ?? "";

    await setCached(key, systemPrompt, CACHE_TTL.PROMPT_SECONDS);
    return systemPrompt;
  },

  async updateSystemPrompt(ownerId: string, newPrompt: string): Promise<void> {
    const trimmed = newPrompt.trim();

    if (trimmed.length < MIN_PROMPT_LENGTH) {
      throw new ValidationError(`Prompt too short (min ${MIN_PROMPT_LENGTH} chars)`);
    }

    if (trimmed.length > MAX_PROMPT_LENGTH) {
      throw new ValidationError(`Prompt too long (max ${MAX_PROMPT_LENGTH} chars)`);
    }

    await promptRepository.update(ownerId, trimmed);
    await invalidateCache(cacheKey("prompt", ownerId));
  },
};
