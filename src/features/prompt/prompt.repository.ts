import { prisma } from "../../database/prisma.js";

export const promptRepository = {
  async findByOwnerId(ownerId: string) {
    return prisma.prompt.findUnique({ where: { ownerId } });
  },

  async update(ownerId: string, systemPrompt: string) {
    return prisma.prompt.update({
      where: { ownerId },
      data: { systemPrompt, isDefault: false },
    });
  },
};
