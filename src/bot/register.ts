import { Bot } from "grammy";

import { registerStartCommand } from "./commands/start.command.js";

import type { BotContext } from "../types/context.js";

export function register(bot: Bot<BotContext>) {
  registerStartCommand(bot);
}
