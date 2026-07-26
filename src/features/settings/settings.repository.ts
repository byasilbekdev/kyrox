import { prisma } from "../../database/prisma.js";
import type { UpdateSettingsInput } from "./settings.types.js";

export const settingsRepository = {
  async findByOwnerId(ownerId: string) {
    return prisma.settings.findUnique({ where: { ownerId } });
  },

  async update(ownerId: string, input: UpdateSettingsInput) {
    return prisma.settings.update({
      where: { ownerId },
      data: input,
    });
  },
};
