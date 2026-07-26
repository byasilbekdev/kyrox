import { conversationRepository } from "./conversation.repository.js";
import type { AppendMessageInput, ChatMessage } from "./conversation.types.js";

const SUMMARIZE_THRESHOLD = 30;
const KEEP_RECENT_MESSAGES = 12;

export const conversationService = {
  async getOrCreateConversation(ownerId: string, visitorId: string) {
    return conversationRepository.findOrCreate(ownerId, visitorId);
  },

  async appendMessage(input: AppendMessageInput) {
    const conversation = await conversationRepository.findOrCreate(
      input.ownerId,
      input.visitorId
    );

    const message = await conversationRepository.appendMessage(
      conversation.id,
      input.role,
      input.content,
      input.tokenCount
    );

    await conversationRepository.touchLastMessageAt(conversation.id);

    return { conversation, message };
  },

  async buildContextWindow(conversationId: string, maxRecentMessages = 20): Promise<{
    summary: string | null;
    recentMessages: ChatMessage[];
  }> {
    const [summary, recentMessages] = await Promise.all([
      conversationRepository.getSummary(conversationId),
      conversationRepository.getRecentMessages(conversationId, maxRecentMessages),
    ]);

    return {
      summary,
      recentMessages: recentMessages.map((m: { role: string; content: string }) => ({
        role: m.role as ChatMessage["role"],
        content: m.content,
      })),
    };
  },

  async maybeCompactConversation(
    conversationId: string,
    summarize: (messages: ChatMessage[], existingSummary: string | null) => Promise<string>
  ): Promise<void> {
    const count = await conversationRepository.countMessages(conversationId);
    if (count < SUMMARIZE_THRESHOLD) return;

    const [existingSummary, allRecent] = await Promise.all([
      conversationRepository.getSummary(conversationId),
      conversationRepository.getRecentMessages(conversationId, count),
    ]);

    const toSummarize = allRecent
      .slice(0, count - KEEP_RECENT_MESSAGES)
      .map((m: { role: string; content: string }) => ({
        role: m.role as ChatMessage["role"],
        content: m.content,
      }));

    const newSummary = await summarize(toSummarize, existingSummary);

    await conversationRepository.setSummary(conversationId, newSummary);
    await conversationRepository.deleteOldMessages(conversationId, KEEP_RECENT_MESSAGES);
  },

  async exportConversationsForOwner(ownerId: string) {
    return conversationRepository.findAllForOwner(ownerId);
  },
};
