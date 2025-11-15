import type { Context, MiddlewareHandler } from "hono";
import { TokenCookieService } from "../services/tokenCookieService.ts";
import { ApiError } from "@shared/entities/api/apiError.ts";
import { STATUS_CODE } from "@std/http/status";

/**
 * Authentication middleware for Hono
 * Verifies JWT token from cookie and attaches user payload to context
 * Automatically refreshes token if needed (sliding sessions)
 *
 * Usage:
 * ```typescript
 * app.use('/api/v1/protected/*', requireAuth());
 * app.get('/api/v1/protected/data', (c) => {
 *   const user = c.get('user'); // Strongly typed TokenPayload
 *   return c.json({ userId: user.userId });
 * });
 * ```
 */
export function requireAuth(): MiddlewareHandler {
  return async (c: Context, next) => {
    // Extract and verify token from cookie
    const payload = await TokenCookieService.getTokenFromCookie(c);

    if (!payload) {
      // No valid token found
      const errorData = {
        message: "Authentication required. Please log in.",
        code: ApiError.InternalCodes.UNAUTHORISED_ACCESS,
      };
      return c.json(new ApiError(errorData), STATUS_CODE.Unauthorized);
    }

    // Attach user payload to context for use in route handlers
    c.set("user", payload);

    // Check if token needs refresh (sliding session)
    // This happens transparently - user doesn't need to re-authenticate
    await TokenCookieService.refreshTokenCookieIfNeeded(c, payload);

    // Continue to route handler
    await next();
  };
}
