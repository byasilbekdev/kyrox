import { prisma } from "../../database/prisma.js";
import type { MessageRole } from "./conversation.types.js";

export const conversationRepository = {
  async findOrCreate(ownerId: string, visitorId: string) {
    return prisma.conversation.upsert({
      where: { ownerId_visitorId: { ownerId, visitorId } },
      create: { ownerId, visitorId },
      update: {},
    });
  },

  async touchLastMessageAt(conversationId: string) {
    return prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });
  },

  async appendMessage(
    conversationId: string,
    role: MessageRole,
    content: string,
    tokenCount?: number
  ) {
    return prisma.message.create({
      data: { conversationId, role, content, tokenCount: tokenCount ?? null },
    });
  },

  async getRecentMessages(conversationId: string, limit: number) {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return messages.reverse();
  },

  async countMessages(conversationId: string) {
    return prisma.message.count({ where: { conversationId } });
  },

  async setSummary(conversationId: string, summary: string) {
    return prisma.conversation.update({
      where: { id: conversationId },
      data: { summary },
    });
  },

  async getSummary(conversationId: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { summary: true },
    });
    return conversation?.summary ?? null;
  },

  async deleteOldMessages(conversationId: string, keepLastN: number) {
    const toKeep = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
      take: keepLastN,
      select: { id: true },
    });

    const keepIds = toKeep.map((m: { id: string }) => m.id);

    return prisma.message.deleteMany({
      where: {
        conversationId,
        id: { notIn: keepIds },
      },
    });
  },

  async findAllForOwner(ownerId: string) {
    return prisma.conversation.findMany({
      where: { ownerId },
      include: { messages: { orderBy: { createdAt: "asc" } }, visitor: true },
      orderBy: { lastMessageAt: "desc" },
    });
  },
};
