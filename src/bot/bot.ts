import { Bot } from "grammy";

import { env } from "../config/env.js";
import type { BotContext } from "../types/context.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { register } from "./register.js";

export const bot = new Bot<BotContext>(env.BOT_TOKEN);

register(bot);

bot.catch(errorMiddleware);
