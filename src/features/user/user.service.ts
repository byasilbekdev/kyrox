import { UnauthorizedError } from "../../utils/errors.js";
import { userRepository } from "./user.repository.js";
import type { TelegramUserInput } from "./user.types.js";

export const userService = {
  async syncFromTelegram(input: TelegramUserInput) {
    return userRepository.upsertFromTelegram(input);
  },

  async getByTelegramId(telegramId: bigint) {
    return userRepository.findByTelegramId(telegramId);
  },

  async assertNotBlocked(telegramId: bigint): Promise<void> {
    const user = await userRepository.findByTelegramId(telegramId);
    if (user?.isBlocked) {
      throw new UnauthorizedError("User is blocked", { telegramId: telegramId.toString() });
    }
  },

  async blockUser(userId: string) {
    return userRepository.setBlocked(userId, true);
  },

  async unblockUser(userId: string) {
    return userRepository.setBlocked(userId, false);
  },

  async getStats() {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [total, activeToday] = await Promise.all([
      userRepository.count(),
      userRepository.countActiveSince(dayAgo),
    ]);
    return { total, activeToday };
  },
};
