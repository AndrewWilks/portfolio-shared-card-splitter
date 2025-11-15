import { zValidator } from "@hono/zod-validator";
import { STATUS_CODE } from "@std/http/status";
import type { Context } from "hono";
import { createFactory } from "hono/factory";

// Entities and Types
import { User } from "@shared/entities/user/index.ts";
import { ApiError, type TApiError } from "@shared/entities/api/apiError.ts";

// Services
import { TokenService } from "../services/tokenService.ts";
import { TokenCookieService } from "../services/tokenCookieService.ts";
import { BootstrapService } from "../services/bootstrapService.ts";

const factory = createFactory();

/**
 * GET /api/v1/bootstrap/status
 * Check if the system has been bootstrapped
 */
export const getBootstrapStatus = async (c: Context) => {
  try {
    const isBootstrapped = await BootstrapService.isBootstrapped();
    return c.json(isBootstrapped);
  } catch (error) {
    return c.json(
      new ApiError({
        message: (error as Error).message,
        code: ApiError.InternalCodes.SYSTEM_BOOTSTRAP_CHECK_FAILED,
      }),
      STATUS_CODE.InternalServerError
    );
  }
};

/**
 * POST /api/v1/bootstrap
 * Create the first user and bootstrap the system
 */
export const createBootstrap = factory.createHandlers(
  zValidator("json", User.bootstrapSchema, (result, c) => {
    if (!result.success) {
      const errorData: TApiError = {
        message: "Invalid bootstrap data",
        code: ApiError.InternalCodes.INVALID_BOOTSTRAP_DATA,
      };
      return c.json(new ApiError(errorData), STATUS_CODE.BadRequest);
    }
  }),
  async (c) => {
    const { email, password, firstName, lastName } = c.req.valid("json");

    // Create the first user
    const response = await BootstrapService.bootstrapFirstUser(
      email,
      password,
      firstName,
      lastName
    );

    if (response instanceof ApiError) {
      return c.json(response, STATUS_CODE.BadRequest);
    }

    if (!response.data) {
      const errorData: TApiError = {
        message: "Bootstrap failed: No user data returned",
        code: ApiError.InternalCodes.INVALID_BOOTSTRAP_DATA,
      };
      return c.json(new ApiError(errorData), STATUS_CODE.BadRequest);
    }

    // Create token and set cookie (auto-login after bootstrap)
    const token = await TokenService.createToken(response.data.id);
    TokenCookieService.setTokenCookie(c, token);

    return c.json(response, STATUS_CODE.Created);
  }
);
