import { STATUS_CODE } from "@std/http";
import { createFactory } from "hono/factory";

// Entities and Types
import { ApiError, type TApiError } from "@shared/entities/api/apiError.ts";
import { ApiResponse } from "@shared/entities/api/apiResponse.ts";
import { User } from "@shared/entities/user/index.ts";
import { Card } from "@shared/entities/card.ts";

// Services
import { UserService } from "../services/userService.ts";
import { UserPreferencesService } from "../services/userPreferencesService.ts";
import { CardService } from "../services/cardService.ts";

const factory = createFactory();

/**
 * POST /api/v1/onboard
 * Complete user onboarding with optional card creation
 */
export const onboardUser = factory.createHandlers(async (c) => {
  const user = c.get("user");
  const json = await c.req.json();

  // Validate request body using User.onboardingSchema
  const parseResult = User.onboardingSchema.safeParse(json);
  if (!parseResult.success) {
    return c.json(
      new ApiError({
        message: "Invalid onboarding data",
        code: ApiError.InternalCodes.INVALID_USER_DATA,
        details: parseResult.error.issues.toString(),
      }),
      STATUS_CODE.BadRequest,
    );
  }

  const { firstName, lastName, preferences, card } = parseResult.data;

  // 1. Update user record (firstName, lastName, hasOnboarded=true)
  const updatedUser = await UserService.updateUser(user.userId, {
    firstName,
    lastName,
    hasOnboarded: true,
  });

  if (updatedUser instanceof ApiError) {
    return c.json(updatedUser, UserService.mapErrorToStatusCode(updatedUser));
  }

  // 2. Create or update user preferences
  const userPrefs = await UserPreferencesService.create({
    userId: user.userId,
    notifications: preferences.notifications,
    darkMode: preferences.darkMode,
    currency: preferences.currency,
  });

  if (userPrefs instanceof ApiError) {
    return c.json(
      userPrefs,
      UserPreferencesService.mapErrorToStatusCode(userPrefs),
    );
  }

  // 3. Create card if provided
  let createdCard: Card | null = null;
  if (card) {
    const newCard = await CardService.createCard({
      ownerId: user.userId,
      name: card.name,
      type: card.type,
      last4: card.last4,
    });

    if (newCard instanceof ApiError) {
      return c.json(newCard, CardService.mapErrorToStatusCode(newCard));
    }

    createdCard = newCard;
  }

  // 4. Return response with user, preferences, and optional card
  const response = new ApiResponse({
    message: "User onboarding completed successfully",
    data: {
      user: updatedUser.toJSON(),
      preferences: userPrefs.toJSON(),
      card: createdCard?.toJSON() ?? null,
    },
  });

  return c.json(response.toJSON(), STATUS_CODE.OK);
});

export const offboardUser = factory.createHandlers(async (c) => {
  const user = c.get("user");

  const offboardingResult = await UserService.offboardUser(user.userId);

  if (offboardingResult instanceof ApiError) {
    const apiError = offboardingResult as TApiError;
    return c.json(
      apiError,
      UserService.mapErrorToStatusCode(offboardingResult),
    );
  }

  const response = new ApiResponse({
    message: "User offboarding completed successfully",
    data: offboardingResult,
  });

  return c.json(response.toJSON(), STATUS_CODE.OK);
});
