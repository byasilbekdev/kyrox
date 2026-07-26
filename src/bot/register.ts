import { session, type Bot } from "grammy";

import type { BotContext, BotSessionData } from "../types/context.js";
import { registerAdminCommand } from "./commands/admin.command.js";
import { registerHelpCommand } from "./commands/help.command.js";
import { registerStartCommand } from "./commands/start.command.js";
import { registerAdminHandlers } from "./handlers/admin.handler.js";
import { registerAdminInputHandler } from "./handlers/admin-input.handler.js";
import { registerMessageHandler } from "./handlers/message.handler.js";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import { maintenanceMiddleware } from "./middlewares/maintenance.middleware.js";
import { userMiddleware } from "./middlewares/user.middleware.js";
import { redisSessionStorage } from "./session.storage.js";

export function register(bot: Bot<BotContext>): void {
  bot.use(loggerMiddleware);
  bot.use(
    session<BotSessionData, BotContext>({
      initial: (): BotSessionData => ({}),
      storage: redisSessionStorage,
    }),
  );
  bot.use(userMiddleware);

  bot.use(maintenanceMiddleware);

  registerStartCommand(bot);
  
  registerHelpCommand(bot);
  registerAdminCommand(bot);

  registerAdminHandlers(bot);
  registerAdminInputHandler(bot);

  registerMessageHandler(bot);
}
