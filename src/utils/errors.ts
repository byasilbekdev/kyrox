export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly isOperational: boolean;

  constructor(message: string, readonly context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  readonly code = "NOT_FOUND";
  readonly isOperational = true;
}

export class ValidationError extends AppError {
  readonly code = "VALIDATION_ERROR";
  readonly isOperational = true;
}

export class UnauthorizedError extends AppError {
  readonly code = "UNAUTHORIZED";
  readonly isOperational = true;
}

export class RateLimitError extends AppError {
  readonly code = "RATE_LIMITED";
  readonly isOperational = true;
}

export class AiProviderError extends AppError {
  readonly code = "AI_PROVIDER_ERROR";
  readonly isOperational = true;
}

export class MaintenanceModeError extends AppError {
  readonly code = "MAINTENANCE_MODE";
  readonly isOperational = true;
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
