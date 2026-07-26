import type { Context, SessionFlavor } from "grammy";

import type { User } from "../generated/prisma/index.js";

export type PendingAdminStep =
  | "AWAITING_PROMPT"
  | "AWAITING_TEMPERATURE"
  | "AWAITING_MAX_TOKENS"
  | "AWAITING_BROADCAST_MESSAGE"
  | "AWAITING_IMPORT_PROMPT"
  | "AWAITING_CHANNEL_ID";

export interface BotSessionData {
  pendingAdminStep?: PendingAdminStep;
}

type BaseContext = Context & SessionFlavor<BotSessionData>;

export interface BotContext extends BaseContext {
  dbUser: User;
  ownerId?: string;
}
