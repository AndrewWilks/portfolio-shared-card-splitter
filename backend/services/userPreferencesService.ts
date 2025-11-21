import { UserPreferences } from "@shared/entities/userPreferences.ts";
import { ApiError } from "@shared/entities/api/apiError.ts";
import { STATUS_CODE } from "@std/http";
import { UserPreferencesRepository } from "@backend/repositories/userPreferencesRepository.ts";
import {
  DB_UserPreferencesCreate,
  DB_UserPreferencesUpdate,
} from "@backend/db/types.ts";

/**
 * UserPreferencesService handles business logic related to user preferences
 * Sits between routes and repository for validation and transformation
 */
export class UserPreferencesService {
  /**
   * Get preferences by user ID with validation
   * @param userId - User ID (UUID)
   * @returns UserPreferences entity or ApiError
   */
  static async getByUserId(
    userId: string,
  ): Promise<UserPreferences | ApiError> {
    const parsed = UserPreferences.userIdSchema.safeParse(userId);
    if (!parsed.success) {
      return new ApiError({
        message: "Invalid user ID",
        code: ApiError.InternalCodes.INVALID_USER_ID,
        details: parsed.error.issues.toString(),
      });
    }

    const dbPrefs = await UserPreferencesRepository.getByUserId(userId);
    if (!dbPrefs) {
      return new ApiError({
        message: "User preferences not found",
        code: ApiError.InternalCodes.USER_NOT_FOUND,
      });
    }

    return UserPreferences.create(dbPrefs);
  }

  /**
   * Create user preferences with validation
   * @param data - Preferences creation data
   * @returns Created UserPreferences entity or ApiError
   */
  static async create(
    data: DB_UserPreferencesCreate,
  ): Promise<UserPreferences | ApiError> {
    const parseResult = UserPreferences.createSchema.safeParse(data);
    if (!parseResult.success) {
      return new ApiError({
        message: "Invalid preferences data",
        code: ApiError.InternalCodes.INVALID_USER_DATA,
        details: parseResult.error.issues.toString(),
      });
    }

    const dbPrefs = await UserPreferencesRepository.create(parseResult.data);
    if (!dbPrefs) {
      return new ApiError({
        message: "Failed to create preferences",
        code: ApiError.InternalCodes.USER_CREATION_FAILED,
      });
    }

    return UserPreferences.create(dbPrefs);
  }

  /**
   * Update preferences by user ID with validation
   * @param userId - User ID (UUID)
   * @param data - Update data
   * @returns Updated UserPreferences entity or ApiError
   */
  static async updateByUserId(
    userId: string,
    data: DB_UserPreferencesUpdate,
  ): Promise<UserPreferences | ApiError> {
    const parseResult = UserPreferences.updateSchema.partial().safeParse(data);
    if (!parseResult.success) {
      return new ApiError({
        message: "Invalid preferences data",
        code: ApiError.InternalCodes.INVALID_USER_DATA,
        details: parseResult.error.issues.toString(),
      });
    }

    const dbPrefs = await UserPreferencesRepository.updateByUserId(
      userId,
      parseResult.data,
    );
    if (!dbPrefs) {
      return new ApiError({
        message: "Preferences not found",
        code: ApiError.InternalCodes.USER_NOT_FOUND,
      });
    }

    return UserPreferences.create(dbPrefs);
  }

  /**
   * Map ApiError to HTTP status code
   * @param error - ApiError instance
   * @returns HTTP status code
   */
  static mapErrorToStatusCode(error: ApiError) {
    switch (error.code) {
      case ApiError.InternalCodes.INVALID_USER_DATA:
      case ApiError.InternalCodes.INVALID_USER_ID:
        return STATUS_CODE.BadRequest;
      case ApiError.InternalCodes.USER_NOT_FOUND:
        return STATUS_CODE.NotFound;
      case ApiError.InternalCodes.USER_CREATION_FAILED:
        return STATUS_CODE.InternalServerError;
      default:
        return STATUS_CODE.InternalServerError;
    }
  }
}
