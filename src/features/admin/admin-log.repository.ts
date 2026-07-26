import { prisma } from "../../database/prisma.js";
import type { AdminAction, Prisma } from "../../generated/prisma/index.js";

export const adminLogRepository = {
  async record(ownerId: string, action: AdminAction, metadata?: Prisma.InputJsonValue) {
    return prisma.adminLog.create({
      data: { ownerId, action, metadata: metadata ?? undefined },
    });
  },

  async findRecentForOwner(ownerId: string, limit = 50) {
    return prisma.adminLog.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },
};
