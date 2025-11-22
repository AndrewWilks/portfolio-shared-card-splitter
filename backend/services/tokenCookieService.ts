import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { config } from "../.config/evnLoader.ts";
import {
  TokenExpiredError,
  TokenInvalidError,
  TokenMalformedError,
  type TokenPayload,
  TokenService,
} from "./tokenService.ts";

const COOKIE_NAME = "session";

/**
 * Cookie utilities for managing JWT tokens in HTTP-only cookies
 */
export class TokenCookieService {
  /**
   * Set a token in an HTTP-only cookie
   * @param c - Hono context
   * @param token - JWT token string
   */
  static setTokenCookie(c: Context, token: string): void {
    const cfg = config();
    const isProduction = cfg.ENV === "production";

    setCookie(c, COOKIE_NAME, token, {
      path: "/",
      httpOnly: true,
      secure: isProduction,
      sameSite: "Strict",
      maxAge: cfg.SESSION_MAX_AGE,
    });
  }

  /**
   * Get and verify token from cookie
   * @param c - Hono context
   * @returns Validated TokenPayload or null if no valid token
   */
  static async getTokenFromCookie(c: Context): Promise<TokenPayload | null> {
    const token = getCookie(c, COOKIE_NAME);

    if (!token) {
      return null;
    }

    try {
      return await TokenService.verifyToken(token);
    } catch (error) {
      // Return null for any token errors - let middleware handle error responses
      if (
        error instanceof TokenExpiredError ||
        error instanceof TokenInvalidError ||
        error instanceof TokenMalformedError
      ) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Clear the session cookie (for logout)
   * @param c - Hono context
   */
  static clearTokenCookie(c: Context): void {
    const cfg = config();
    const isProduction = cfg.ENV === "production";

    deleteCookie(c, COOKIE_NAME, {
      path: "/",
      secure: isProduction,
      sameSite: "Strict",
    });
  }

  /**
   * Check if token needs refresh and update cookie if needed
   * @param c - Hono context
   * @param payload - Current token payload
   * @returns True if token was refreshed
   */
  static async refreshTokenCookieIfNeeded(
    c: Context,
    payload: TokenPayload,
  ): Promise<boolean> {
    if (TokenService.shouldRefreshToken(payload)) {
      const newToken = await TokenService.createRefreshedToken(payload);
      this.setTokenCookie(c, newToken);
      return true;
    }
    return false;
  }
}
