import { env } from "../../config/env.js";
import { AiProviderError } from "../../utils/errors.js";
import type { AiCompletionRequest } from "./ai.types.js";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 45_000;

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function buildMessages(request: AiCompletionRequest): OpenRouterMessage[] {
  const messages: OpenRouterMessage[] = [{ role: "system", content: request.systemPrompt }];

  if (request.summary) {
    messages.push({ role: "system", content: `Oldingi suhbat xulosasi: ${request.summary}` });
  }

  for (const message of request.messages) {
    if (message.role === "SYSTEM") continue;
    messages.push({
      role: message.role === "USER" ? "user" : "assistant",
      content: message.content,
    });
  }

  return messages;
}

/**
 * Streams completion chunks via an async generator. Caller decides
 * how to forward chunks (e.g. periodic Telegram message edits).
 */
export async function* streamOpenRouter(
  request: AiCompletionRequest
): AsyncGenerator<string, void, unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: request.model,
        temperature: request.temperature,
        max_tokens: request.maxTokens,
        messages: buildMessages(request),
        stream: true,
      }),
      signal: controller.signal,
    });

    if (!response.ok || !response.body) {
      const errorText = await response.text().catch(() => "");
      throw new AiProviderError(`OpenRouter stream failed: ${response.status}`, {
        status: response.status,
        body: errorText,
      });
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;

        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") return;

        try {
          const parsed = JSON.parse(payload) as {
            choices?: Array<{ delta?: { content?: string } }>;
          };
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) yield delta;
        } catch {
          // Ignore malformed SSE fragments; stream continues.
        }
      }
    }
  } finally {
    clearTimeout(timeout);
  }
}
