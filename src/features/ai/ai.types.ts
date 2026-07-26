import type { ChatMessage } from "../conversation/conversation.types.js";

export interface AiCompletionRequest {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  summary: string | null;
  messages: ChatMessage[];
}

export interface AiCompletionResult {
  content: string;
  promptTokens: number;
  completionTokens: number;
}
