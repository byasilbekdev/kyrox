import { env } from "../../config/env.js";
import { AiProviderError } from "../../utils/errors.js";
import { logger } from "../../utils/logger.js";
import type { AiCompletionRequest, AiCompletionResult } from "./ai.types.js";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 500;

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{ message: { content: string } }>;
  usage?: { prompt_tokens: number; completion_tokens: number };
}

function buildMessages(request: AiCompletionRequest): OpenRouterMessage[] {
  const messages: OpenRouterMessage[] = [{ role: "system", content: request.systemPrompt }];

  if (request.summary) {
    messages.push({
      role: "system",
      content: `Oldingi suhbat xulosasi: ${request.summary}`,
    });
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

async function fetchWithTimeout(input: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function callOpenRouter(request: AiCompletionRequest): Promise<AiCompletionResult> {
  const body = {
    model: request.model,
    temperature: request.temperature,
    max_tokens: request.maxTokens,
    messages: buildMessages(request),
  };

  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(
        OPENROUTER_URL,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
        REQUEST_TIMEOUT_MS
      );

      if (!response.ok) {
        const errorText = await response.text();

        if (response.status === 429 || response.status >= 500) {
          throw new Error(`OpenRouter transient error ${response.status}: ${errorText}`);
        }

        throw new AiProviderError(`OpenRouter request failed: ${response.status}`, {
          status: response.status,
          body: errorText,
        });
      }

      const data = (await response.json()) as OpenRouterResponse;
      const content = data.choices[0]?.message.content ?? "";

      return {
        content,
        promptTokens: data.usage?.prompt_tokens ?? 0,
        completionTokens: data.usage?.completion_tokens ?? 0,
      };
    } catch (error) {
      lastError = error;

      if (error instanceof AiProviderError) throw error;

      const isLastAttempt = attempt === MAX_RETRIES;
      logger.warn("OpenRouter call failed, retrying", {
        attempt,
        isLastAttempt,
        error: error instanceof Error ? error.message : String(error),
      });

      if (!isLastAttempt) {
        await sleep(RETRY_BASE_DELAY_MS * 2 ** attempt);
      }
    }
  }

  throw new AiProviderError("OpenRouter request failed after retries", {
    lastError: lastError instanceof Error ? lastError.message : String(lastError),
  });
}
