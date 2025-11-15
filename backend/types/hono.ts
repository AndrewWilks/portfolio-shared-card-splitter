import type { TokenPayload } from "../services/tokenService.ts";

/**
 * Extend Hono's context Variables to include authenticated user payload
 * This provides type-safe access to user data in protected routes
 *
 * Usage in route handlers:
 * ```typescript
 * app.get('/api/v1/protected/data', (c) => {
 *   const user = c.get('user'); // TypeScript knows this is TokenPayload | undefined
 *   if (user) {
 *     console.log(user.userId); // Full IntelliSense support
 *   }
 * });
 * ```
 */
declare module "hono" {
  interface ContextVariableMap {
    user: TokenPayload;
  }
}

export type {};
