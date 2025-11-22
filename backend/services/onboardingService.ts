import { STATUS_CODE } from "@std/http/status";

// Entities and Types
import {
  type TApiResponse,
  UserOnboarding,
} from "@shared/entities/user/onboarding.ts";
import { ApiError, type TApiError } from "@shared/entities/api/apiError.ts";

// Import Repositories needed
import { UserRepository } from "../repositories/userRepository.ts";
import { UserPreferencesRepository } from "../repositories/userPreferencesRepository.ts";
import { CardRepository } from "../repositories/cardRepository.ts";

export class OnboardingService {
  static async onBoardUser(
    data: unknown,
    userId: string,
  ): Promise<TApiResponse | TApiError> {
    // Validate request body
    const parseResult = UserOnboarding.apiRequestDataSchema.safeParse(data);

    if (!parseResult.success) {
      return new ApiError({
        message: "Invalid onboarding data",
        code: ApiError.InternalCodes.ONBOARDING_FAILED,
        details: parseResult.error.issues.toString(),
      });
    }

    // 0. get exsisting user data
    const userBeforeUpdate = await UserRepository.getById(userId);
    if (!userBeforeUpdate) {
      return new ApiError({
        message: "User not found",
        code: ApiError.InternalCodes.USER_NOT_FOUND,
        details: "User not found",
      });
    }

    // 1. Update user record (firstName, lastName)

    let updatedUser: Awaited<ReturnType<typeof UserRepository.update>>;
    try {
      updatedUser = await UserRepository.update(userId, {
        firstName: parseResult.data.firstName,
        lastName: parseResult.data.lastName,
      });
    } catch (error) {
      return new ApiError({
        message: "Failed to update user record",
        code: ApiError.InternalCodes.USER_NOT_FOUND,
        details: (error as Error).message,
      });
    }

    // 2. Create or update user preferences
    let updatedPreferences: Awaited<
      ReturnType<typeof UserPreferencesRepository.create>
    >;
    try {
      updatedPreferences = await UserPreferencesRepository.create({
        userId,
        notifications: parseResult.data.preferences.notifications,
        darkMode: parseResult.data.preferences.darkMode,
        currency: parseResult.data.preferences.currency,
      });
    } catch (error) {
      // Rollback user update
      await UserRepository.update(userId, {
        firstName: userBeforeUpdate.firstName,
        lastName: userBeforeUpdate.lastName,
      });
      return new ApiError({
        message: "Failed to create user preferences",
        code: ApiError.InternalCodes.USER_PREFERENCES_CREATION_FAILED,
        details: (error as Error).message,
      });
    }

    // 3. Create card if provided
    let createdCard: Awaited<ReturnType<typeof CardRepository.create>> | null =
      null;
    if (parseResult.data.card) {
      try {
        createdCard = await CardRepository.create({
          ownerId: userId,
          ...parseResult.data.card,
        });
      } catch (error) {
        // Rollback previous operations
        if (updatedPreferences) {
          await UserPreferencesRepository.delete(updatedPreferences.id);
        }
        await UserRepository.update(userId, {
          firstName: userBeforeUpdate.firstName,
          lastName: userBeforeUpdate.lastName,
        });
        return new ApiError({
          message: "Failed to create card",
          code: ApiError.InternalCodes.CARD_CREATION_FAILED,
          details: (error as Error).message,
        });
      }
    }

    // 4. Mark user as onboarded
    try {
      updatedUser = await UserRepository.onboardUser(userId);
      if (!updatedUser) {
        return new ApiError({
          message: "Failed to mark user as onboarded",
          code: ApiError.InternalCodes.USER_NOT_FOUND,
          details: "User not found for onboarding",
        });
      }
    } catch (error) {
      // Rollback all previous operations
      if (createdCard) {
        await CardRepository.delete(createdCard.id);
      }
      if (updatedPreferences) {
        await UserPreferencesRepository.delete(updatedPreferences.id);
      }
      await UserRepository.update(userId, {
        firstName: userBeforeUpdate.firstName,
        lastName: userBeforeUpdate.lastName,
      });
      return new ApiError({
        message: "Failed to mark user as onboarded",
        code: ApiError.InternalCodes.ONBOARDING_FAILED,
        details: (error as Error).message,
      });
    }

    // 5. Validate all required data is available
    if (!updatedPreferences) {
      return new ApiError({
        message: "Failed to retrieve user preferences",
        code: ApiError.InternalCodes.USER_PREFERENCES_CREATION_FAILED,
        details: "User preferences were not created properly",
      });
    }

    // 6. Return response
    return UserOnboarding.createApiResponse({
      card: createdCard!,
      preferences: updatedPreferences!,
      user: updatedUser!,
    });
  }

  static mapErrorToStatusCode(error: ApiError) {
    switch (error.code) {
      case ApiError.InternalCodes.ONBOARDING_FAILED:
        return STATUS_CODE.BadRequest; // Bad Request

      case ApiError.InternalCodes.USER_NOT_FOUND:
        return STATUS_CODE.NotFound; // Not Found

      case ApiError.InternalCodes.CARD_CREATION_FAILED:
      case ApiError.InternalCodes.USER_PREFERENCES_CREATION_FAILED:
        return STATUS_CODE.InternalServerError; // Internal Server Error

      default:
        return STATUS_CODE.InternalServerError; // Internal Server Error for unknown codes
    }
  }
}
