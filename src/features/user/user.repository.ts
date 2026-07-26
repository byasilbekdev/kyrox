import { prisma } from "../../database/prisma.js";
import type { TelegramUserInput } from "./user.types.js";

export const userRepository = {
  async findByTelegramId(telegramId: bigint) {
    return prisma.user.findUnique({ where: { telegramId } });
  },

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async upsertFromTelegram(input: TelegramUserInput) {
    return prisma.user.upsert({
      where: { telegramId: input.telegramId },
      create: {
        telegramId: input.telegramId,
        username: input.username ?? null,
        firstName: input.firstName,
        lastName: input.lastName ?? null,
        languageCode: input.languageCode ?? null,
        isPremium: input.isPremium ?? false,
        isBot: input.isBot ?? false,
        lastSeenAt: new Date(),
      },
      update: {
        username: input.username ?? null,
        firstName: input.firstName,
        lastName: input.lastName ?? null,
        languageCode: input.languageCode ?? null,
        isPremium: input.isPremium ?? false,
        lastSeenAt: new Date(),
      },
    });
  },

  async setBlocked(userId: string, isBlocked: boolean) {
    return prisma.user.update({
      where: { id: userId },
      data: { isBlocked },
    });
  },

  async setRole(userId: string, role: "USER" | "ADMIN") {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  },

  async count() {
    return prisma.user.count();
  },

  async countActiveSince(date: Date) {
    return prisma.user.count({
      where: { lastSeenAt: { gte: date } },
    });
  },
};
