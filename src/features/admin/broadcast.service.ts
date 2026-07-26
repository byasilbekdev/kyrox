import type { Api } from "grammy";

import { prisma } from "../../database/prisma.js";
import { logger } from "../../utils/logger.js";

const SEND_DELAY_MS = 50;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const broadcastService = {
  async broadcastToVisitors(
    api: Api,
    ownerId: string,
    text: string
  ): Promise<{ sent: number; failed: number }> {
    const conversations = await prisma.conversation.findMany({
      where: { ownerId },
      select: { visitor: { select: { telegramId: true } } },
      distinct: ["visitorId"],
    });

    let sent = 0;
    let failed = 0;

    for (const { visitor } of conversations) {
      try {
        await api.sendMessage(visitor.telegramId.toString(), text);
        sent++;
      } catch (error) {
        failed++;
        logger.warn("Broadcast delivery failed", {
          telegramId: visitor.telegramId.toString(),
          error: error instanceof Error ? error.message : String(error),
        });
      }
      await sleep(SEND_DELAY_MS);
    }

    return { sent, failed };
  },
};
