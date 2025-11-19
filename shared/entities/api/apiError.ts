import { z } from "zod";

export class ApiError implements IApiError {
  public readonly message: string;
  public readonly code: ApiErrorInternalCodes;
  public readonly details?: string;

  constructor(data: TApiError) {
    this.message = data.message;
    this.code = data.code;
    this.details = data.details;
  }

  static get InternalCodes() {
    return ApiErrorInternalCodes;
  }

  static get schema() {
    return z
      .object({
        message: z.string(),
        code: z.enum(ApiErrorInternalCodes),
        details: z.string().optional(),
      })
      .strict();
  }

  static parse(data: unknown): ApiError {
    const parsed = ApiError.schema.parse(data);
    return new ApiError(parsed);
  }

  static safeParse(
    data: unknown
  ): { success: true; data: ApiError } | { success: false; error: z.ZodError } {
    const parsed = ApiError.schema.safeParse(data);

    if (parsed.success) {
      return { success: true, data: new ApiError(parsed.data) };
    }

    return parsed;
  }

  toString(): string {
    return `ApiError: [code=${this.code}, message=${this.message}, details=${
      this.details ?? "N/A"
    }]`;
  }

  serialize(): string {
    return JSON.stringify({
      message: this.message,
      code: this.code,
      details: this.details,
    });
  }

  toJSON(): TApiError {
    return {
      message: this.message,
      code: this.code,
      details: this.details,
    };
  }
}

export type TApiError = {
  message: string;
  code: ApiErrorInternalCodes;
  details?: string;
};

interface IApiError {
  message: string;
  code: ApiErrorInternalCodes;
  details?: string;

  toString(): string;
  serialize(): string;
}

enum ApiErrorInternalCodes {
  // General Errors
  UNKNOWN_ERROR = -999,

  // Bootstrap Errors
  SYSTEM_ALREADY_BOOTSTRAPPED = 1,
  SYSTEM_NOT_BOOTSTRAPPED = 2,
  INVALID_BOOTSTRAP_DATA = 3,
  SYSTEM_BOOTSTRAP_FAILED = 4,
  SYSTEM_BOOTSTRAP_CHECK_FAILED = 5,

  // Authentication and Authorization Errors
  INVALID_LOGIN_DATA = 1001,
  INVALID_LOGOUT_DATA = 1002,
  UNAUTHORISED_ACCESS = 1003,
  TOKEN_EXPIRED = 1004,

  // Session Errors
  NO_ACTIVE_SESSION = 2001,
  SESSION_EXPIRED = 2002,

  // User Errors
  USER_NOT_FOUND = 3001,
  USER_ALREADY_EXISTS = 3002,
}
