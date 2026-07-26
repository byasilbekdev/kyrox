export interface OwnerWithRelations {
  id: string;
  userId: string;
  isActive: boolean;
  maintenanceMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOwnerInput {
  userId: string;
  defaultPrompt: string;
  defaultAiModel: string;
  defaultTemperature: number;
  defaultMaxTokens: number;
}
