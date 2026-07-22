import { bot } from "./bot.js";
import { registerBusinessHandler } from "./handlers/business-message.handler.js";

registerBusinessHandler(bot);

bot.start();

console.log("🤖 AI Secretary started");
