export interface TelegramUserInput {
  telegramId: bigint;
  username?: string | null;
  firstName: string;
  lastName?: string | null;
  languageCode?: string | null;
  isPremium?: boolean;
  isBot?: boolean;
}

export interface UserDto {
  id: string;
  telegramId: bigint;
  username: string | null;
  firstName: string;
  lastName: string | null;
  languageCode: string | null;
  role: "USER" | "ADMIN";
  isPremium: boolean;
  isBot: boolean;
  isBlocked: boolean;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
