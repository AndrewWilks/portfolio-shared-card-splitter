import { STATUS_CODE } from "@std/http";
import { createFactory } from "hono/factory";
import { OnboardingService } from "../services/onboardingService.ts";
import { ApiError } from "@shared/entities/api/apiError.ts";

const factory = createFactory();

/**
 * POST /api/v1/onboard
 * Complete user onboarding with optional card creation
 */
export const onboardUser = factory.createHandlers(async (c) => {
  const user = c.get("user");
  const json = await c.req.json();

  const response = await OnboardingService.onBoardUser(json, user.userId);

  if (response instanceof ApiError) {
    return c.json(response, OnboardingService.mapErrorToStatusCode(response));
  }

  return c.json(response, STATUS_CODE.OK);
});
