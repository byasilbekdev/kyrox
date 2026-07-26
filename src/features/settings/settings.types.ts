export interface SettingsDto {
  aiEnabled: boolean;
  aiModel: string;
  temperature: number;
  maxTokens: number;
  language: string;
}

export interface UpdateSettingsInput {
  aiEnabled?: boolean;
  aiModel?: string;
  temperature?: number;
  maxTokens?: number;
  language?: string;
}
