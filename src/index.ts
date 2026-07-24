import { bot } from "./bot/bot.js";
import { prisma } from "./database/prisma.js";

async function bootstrap() {
  await prisma.$connect();

  console.log("✅ Database connected");
  console.log("🤖 Bot is starting...");
  await bot.start();
}

process.once("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.once("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

bootstrap().catch(async (error) => {
  console.error(error);

  await prisma.$disconnect;

  process.exit(1);
});
