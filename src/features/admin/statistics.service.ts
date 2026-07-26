import { prisma } from "../../database/prisma.js";

export const statisticsService = {
  async getOwnerStatistics(ownerId: string) {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [totalConversations, activeToday, activeThisWeek, totalMessages] = await Promise.all([
      prisma.conversation.count({ where: { ownerId } }),
      prisma.conversation.count({ where: { ownerId, lastMessageAt: { gte: dayAgo } } }),
      prisma.conversation.count({ where: { ownerId, lastMessageAt: { gte: weekAgo } } }),
      prisma.message.count({ where: { conversation: { ownerId } } }),
    ]);

    return { totalConversations, activeToday, activeThisWeek, totalMessages };
  },
};
