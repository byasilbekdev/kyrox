import { prisma } from "../../database/prisma.js";

export const channelRepository = {
  async findByOwnerId(ownerId: string) {
    return prisma.channel.findMany({ where: { ownerId, isActive: true } });
  },

  async add(ownerId: string, chatId: bigint, title: string, username: string | null) {
    return prisma.channel.upsert({
      where: { ownerId_chatId: { ownerId, chatId } },
      create: { ownerId, chatId, title, username, isActive: true },
      update: { title, username, isActive: true },
    });
  },

  async remove(ownerId: string, chatId: bigint) {
    return prisma.channel.update({
      where: { ownerId_chatId: { ownerId, chatId } },
      data: { isActive: false },
    });
  },
};
