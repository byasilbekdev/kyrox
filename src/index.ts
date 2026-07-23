import { bot } from "./bot/bot.js";
import { prisma } from "./database/prisma.js";

async function bootstrap() {
  await prisma.$connect();

  console.log("✅ Database connected");
  console.log("🤖 Bot is starting...");
  await bot.start();
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
