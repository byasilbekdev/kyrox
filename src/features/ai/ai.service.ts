import { conversationService } from "../conversation/index.js";
import { promptService } from "../prompt/index.js";
import { settingsService } from "../settings/index.js";
import {
  CACHE_TTL,
  cacheKey,
  getCached,
  setCached,
} from "../../redis/redis.js";
import { callOpenRouter } from "./openrouter.client.js";
import { streamOpenRouter } from "./openrouter-stream.client.js";
import type { AiCompletionResult } from "./ai.types.js";

function buildResponseCacheKey(
  ownerId: string,
  conversationId: string,
  userMessage: string,
) {
  return cacheKey(
    "ai-response",
    ownerId,
    conversationId,
    Buffer.from(userMessage).toString("base64").slice(0, 64),
  );
}

export const aiService = {
  async generateReply(
    ownerId: string,
    visitorId: string,
    userMessage: string,
  ): Promise<AiCompletionResult | null> {
    const settings = await settingsService.getSettings(ownerId);

    if (!settings.aiEnabled) {
      return null;
    }

    const [systemPrompt, conversation] = await Promise.all([
      promptService.getSystemPrompt(ownerId),
      conversationService.getOrCreateConversation(ownerId, visitorId),
    ]);

    const cacheKeyStr = buildResponseCacheKey(
      ownerId,
      conversation.id,
      userMessage,
    );
    const cached = await getCached<AiCompletionResult>(cacheKeyStr);
    if (cached) return cached;

    await conversationService.appendMessage({
      ownerId,
      visitorId,
      role: "USER",
      content: userMessage,
    });

    const context = await conversationService.buildContextWindow(
      conversation.id,
    );

    const result = await callOpenRouter({
      model: settings.aiModel,
      temperature: settings.temperature,
      maxTokens: settings.maxTokens,
      systemPrompt,
      summary: context.summary,
      messages: context.recentMessages,
    });

    await conversationService.appendMessage({
      ownerId,
      visitorId,
      role: "ASSISTANT",
      content: result.content,
      tokenCount: result.completionTokens,
    });

    await conversationService.maybeCompactConversation(
      conversation.id,
      async (messages, existingSummary) =>
        this.summarizeMessages(messages, existingSummary, settings.aiModel),
    );

    await setCached(cacheKeyStr, result, CACHE_TTL.AI_RESPONSE_SECONDS);

    return result;
  },

  async *streamReply(
    ownerId: string,
    visitorId: string,
    userMessage: string,
  ): AsyncGenerator<string, void, unknown> {
    const settings = await settingsService.getSettings(ownerId);
    if (!settings.aiEnabled) return;

    const [systemPrompt, conversation] = await Promise.all([
      promptService.getSystemPrompt(ownerId),
      conversationService.getOrCreateConversation(ownerId, visitorId),
    ]);

    await conversationService.appendMessage({
      ownerId,
      visitorId,
      role: "USER",
      content: userMessage,
    });

    const context = await conversationService.buildContextWindow(
      conversation.id,
    );

    let fullReply = "";
    for await (const chunk of streamOpenRouter({
      model: settings.aiModel,
      temperature: settings.temperature,
      maxTokens: settings.maxTokens,
      systemPrompt,
      summary: context.summary,
      messages: context.recentMessages,
    })) {
      fullReply += chunk;
      yield chunk;
    }

    await conversationService.appendMessage({
      ownerId,
      visitorId,
      role: "ASSISTANT",
      content: fullReply,
    });
  },

  async summarizeMessages(
    messages: { role: string; content: string }[],
    existingSummary: string | null,
    model: string,
  ): Promise<string> {
    const transcript = messages
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");
    const prompt = existingSummary
      ? `Oldingi xulosa: ${existingSummary}\n\nYangi xabarlar:\n${transcript}\n\nYangilangan qisqa xulosani yozing (5-8 gap).`
      : `Quyidagi suhbatni 5-8 gapda qisqacha xulosalang:\n${transcript}`;

    const result = await callOpenRouter({
      model,
      temperature: 0.3,
      maxTokens: 300,
      systemPrompt:
        "Siz suhbat xulosalovchisiz. Faqat qisqa, faktik xulosa yozing.",
      summary: null,
      messages: [{ role: "USER", content: prompt }],
    });

    return result.content;
  },
};
