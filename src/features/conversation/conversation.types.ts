export type MessageRole = "USER" | "ASSISTANT" | "SYSTEM";

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface AppendMessageInput {
  ownerId: string;
  visitorId: string;
  role: MessageRole;
  content: string;
  tokenCount?: number;
}
