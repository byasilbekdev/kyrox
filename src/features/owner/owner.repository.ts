import { prisma } from "../../database/prisma.js";
import type { CreateOwnerInput } from "./owner.types.js";

export const ownerRepository = {
  async findByUserId(userId: string) {
    return prisma.owner.findUnique({ where: { userId } });
  },

  async findById(id: string) {
    return prisma.owner.findUnique({ where: { id } });
  },

  async findByTelegramId(telegramId: bigint) {
    return prisma.owner.findFirst({
      where: { user: { telegramId } },
    });
  },

  async existsAny() {
    const count = await prisma.owner.count();
    return count > 0;
  },

  async create(input: CreateOwnerInput) {
    return prisma.owner.create({
      data: {
        userId: input.userId,
        prompt: {
          create: {
            systemPrompt: input.defaultPrompt,
            isDefault: true,
          },
        },
        settings: {
          create: {
            aiModel: input.defaultAiModel,
            temperature: input.defaultTemperature,
            maxTokens: input.defaultMaxTokens,
          },
        },
      },
      include: { prompt: true, settings: true },
    });
  },

  async setMaintenanceMode(ownerId: string, enabled: boolean) {
    return prisma.owner.update({
      where: { id: ownerId },
      data: { maintenanceMode: enabled },
    });
  },

  async setActive(ownerId: string, isActive: boolean) {
    return prisma.owner.update({
      where: { id: ownerId },
      data: { isActive },
    });
  },
};
