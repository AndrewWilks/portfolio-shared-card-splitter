import { STATUS_CODE } from "@std/http";
import { createFactory } from "hono/factory";

// Entities and Types
import { ApiError, type TApiError } from "@shared/entities/api/apiError.ts";
import { ApiResponse } from "@shared/entities/api/apiResponse.ts";

// Services
import { UserService } from "../services/userService.ts";

const factory = createFactory();

export const onboardUser = factory.createHandlers(async (c) => {
  const user = c.get("user");

  const onboardingResult = await UserService.onboardUser(user.userId);

  if (onboardingResult instanceof ApiError) {
    const apiError = onboardingResult as TApiError;
    return c.json(apiError, UserService.mapErrorToStatusCode(onboardingResult));
  }

  const response = new ApiResponse({
    message: "User onboarding completed successfully",
    data: onboardingResult,
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
      UserService.mapErrorToStatusCode(offboardingResult)
    );
  }

  const response = new ApiResponse({
    message: "User offboarding completed successfully",
    data: offboardingResult,
  });

  return c.json(response.toJSON(), STATUS_CODE.OK);
});
