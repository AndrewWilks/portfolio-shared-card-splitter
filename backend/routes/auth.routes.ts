import { zValidator } from "@hono/zod-validator";
import { STATUS_CODE } from "@std/http/status";
import { createFactory } from "hono/factory";

// Entities and Types
import { User } from "@shared/entities/user/index.ts";
import { ApiError, type TApiError } from "@shared/entities/api/apiError.ts";
import { ApiResponse } from "@shared/entities/api/apiResponse.ts";

// Services
import { TokenService } from "../services/tokenService.ts";
import { TokenCookieService } from "../services/tokenCookieService.ts";
import { UserService } from "../services/userService.ts";

const factory = createFactory();

/**
 * POST /api/v1/auth/login
 * Authenticate user with email and password
 */
export const login = factory.createHandlers(
  zValidator("json", User.loginSchema, (result, c) => {
    if (!result.success) {
      const errorData: TApiError = {
        message: "Invalid login data",
        code: ApiError.InternalCodes.INVALID_LOGIN_DATA,
      };
      return c.json(new ApiError(errorData), 400);
    }
  }),
  async (c) => {
    const { email, password } = c.req.valid("json");

    // Verify credentials with auto-migration from SHA-256 to Argon2id
    const isValid = await UserService.verifyPassword(email, password);

    if (!isValid) {
      const errorData: TApiError = {
        message: "Invalid email or password",
        code: ApiError.InternalCodes.INVALID_LOGIN_DATA,
      };
      return c.json(new ApiError(errorData), STATUS_CODE.Unauthorized);
    }

    // Get user from database
    const userResult = await UserService.getUserByEmail(email);

    if (userResult instanceof ApiError || !userResult) {
      const errorData: TApiError = {
        message: "User not found",
        code: ApiError.InternalCodes.INVALID_LOGIN_DATA,
      };
      return c.json(new ApiError(errorData), STATUS_CODE.Unauthorized);
    }

    // Create token and set cookie
    const token = await TokenService.createToken(userResult.id);
    TokenCookieService.setTokenCookie(c, token);

    const apiResponse = new ApiResponse({
      data: userResult,
      message: "Login successful",
    });

    return c.json(apiResponse, STATUS_CODE.OK);
  },
);

/**
 * POST /api/v1/auth/logout
 * Clear authentication cookie
 */
export const logout = factory.createHandlers((c) => {
  TokenCookieService.clearTokenCookie(c);

  const apiResponse = new ApiResponse({
    message: "Logout successful",
  });

  return c.json(apiResponse, STATUS_CODE.OK);
});

/**
 * GET /api/v1/auth/me
 * Get current authenticated user
 */
export const me = factory.createHandlers(async (c) => {
  // User is already authenticated and attached to context by middleware
  const tokenPayload = c.get("user");

  // Get user from database using the service
  const user = await UserService.getUserById(tokenPayload.userId);

  if (user instanceof ApiError) {
    return c.json(user, STATUS_CODE.NotFound);
  }

  return c.json(
    new ApiResponse({
      data: user,
      message: "User data retrieved successfully",
    }),
    STATUS_CODE.OK,
  );
});
