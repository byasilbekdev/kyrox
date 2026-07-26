import type { Api } from "grammy";

import { channelRepository } from "./channel.repository.js";

const MEMBER_STATUSES = new Set(["creator", "administrator", "member"]);

export const channelService = {
  async listForOwner(ownerId: string) {
    return channelRepository.findByOwnerId(ownerId);
  },

  async addChannel(ownerId: string, chatId: bigint, title: string, username: string | null) {
    return channelRepository.add(ownerId, chatId, title, username);
  },

  async removeChannel(ownerId: string, chatId: bigint) {
    return channelRepository.remove(ownerId, chatId);
  },

  async isMember(api: Api, chatId: bigint, telegramUserId: number): Promise<boolean> {
    try {
      const member = await api.getChatMember(chatId.toString(), telegramUserId);
      return MEMBER_STATUSES.has(member.status);
    } catch {
      // If Telegram can't resolve membership (bot not admin, chat
      // unreachable, etc.) we fail open on verification rather than
      // blocking the visitor from using the bot entirely.
      return true;
    }
  },
};
