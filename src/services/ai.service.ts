import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";
import { AI_MODEL } from "../constants/index.js";
import { SYSTEM_PROMPT } from "../prompts/system.prompt.js";

const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

export async function generateReply(message: string) {
  const response = await ai.models.generateContent({
    model: AI_MODEL,
    contents: message,
    config: {
      systemInstruction: SYSTEM_PROMPT,
    },
  });

  return response.text ?? "Kechirasiz, javob yaratib bo'lmadi.";
}
