import { z } from "zod";
import { config } from "../.config/evnLoader.ts";

// Token payload schema with Zod validation
export const tokenPayloadSchema = z.object({
  userId: z.uuid("userId must be a valid UUID"),
  iat: z.number().int().positive("iat must be a positive integer timestamp"),
  exp: z.number().int().positive("exp must be a positive integer timestamp"),
  // Note: metadata field reserved for future expansion (roles, permissions, etc.)
  // Will be configurable via environment variables when implemented
  // metadata: z.record(z.unknown()).optional(),
});

// Infer TypeScript type from Zod schema for type safety
export type TokenPayload = z.infer<typeof tokenPayloadSchema>;

// Custom error classes for specific token failures
export class TokenExpiredError extends Error {
  constructor(message = "Token has expired") {
    super(message);
    this.name = "TokenExpiredError";
  }
}

export class TokenInvalidError extends Error {
  constructor(message = "Token signature is invalid") {
    super(message);
    this.name = "TokenInvalidError";
  }
}

export class TokenMalformedError extends Error {
  constructor(message = "Token format is malformed") {
    super(message);
    this.name = "TokenMalformedError";
  }
}

/**
 * TokenService handles JWT creation, verification, and validation using Web Crypto API
 * Tokens are signed with HMAC-SHA256 and validated with Zod for type safety
 */
export class TokenService {
  private static textEncoder = new TextEncoder();
  private static textDecoder = new TextDecoder();

  /**
   * Encode string to base64url format (URL-safe base64)
   */
  private static base64urlEncode(data: string): string {
    const base64 = btoa(data);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }

  /**
   * Decode base64url string back to original string
   */
  private static base64urlDecode(data: string): string {
    // Add padding if needed
    let base64 = data.replace(/-/g, "+").replace(/_/g, "/");
    const padding = base64.length % 4;
    if (padding > 0) {
      base64 += "=".repeat(4 - padding);
    }
    return atob(base64);
  }

  /**
   * Convert secret string to CryptoKey for signing/verification
   */
  private static async getSigningKey(secret: string): Promise<CryptoKey> {
    const keyData = this.textEncoder.encode(secret);
    return await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );
  }

  /**
   * Create a signed JWT token for the given user ID
   * @param userId - The user's unique identifier (UUID)
   * @returns Signed JWT token string
   */
  static async createToken(userId: string): Promise<string> {
    const cfg = config();
    const now = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
    const exp = now + cfg.SESSION_MAX_AGE;

    // Build token payload
    const payload: TokenPayload = {
      userId,
      iat: now,
      exp,
    };

    // Validate payload with Zod before signing
    const validatedPayload = tokenPayloadSchema.parse(payload);

    // Create JWT header
    const header = {
      alg: "HS256",
      typ: "JWT",
    };

    // Encode header and payload
    const encodedHeader = this.base64urlEncode(JSON.stringify(header));
    const encodedPayload = this.base64urlEncode(
      JSON.stringify(validatedPayload)
    );

    // Create signature base (header.payload)
    const signatureBase = `${encodedHeader}.${encodedPayload}`;

    // Sign with HMAC-SHA256
    const key = await this.getSigningKey(cfg.SESSION_SECRET);
    const signatureData = this.textEncoder.encode(signatureBase);
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      signatureData
    );

    // Convert signature to base64url
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const signatureString = String.fromCharCode(...signatureArray);
    const encodedSignature = this.base64urlEncode(signatureString);

    // Return complete JWT
    return `${signatureBase}.${encodedSignature}`;
  }

  /**
   * Verify and decode a JWT token
   * @param token - The JWT token string to verify
   * @returns Validated TokenPayload
   * @throws {TokenMalformedError} If token format is invalid
   * @throws {TokenInvalidError} If signature verification fails
   * @throws {TokenExpiredError} If token has expired
   */
  static async verifyToken(token: string): Promise<TokenPayload> {
    // Split token into parts
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new TokenMalformedError(
        "Token must have exactly 3 parts (header.payload.signature)"
      );
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;

    // Verify signature
    const cfg = config();
    const signatureBase = `${encodedHeader}.${encodedPayload}`;
    const key = await this.getSigningKey(cfg.SESSION_SECRET);

    // Decode signature from base64url to buffer
    const signatureString = this.base64urlDecode(encodedSignature);
    const signatureArray = new Uint8Array(
      signatureString.split("").map((c) => c.charCodeAt(0))
    );

    const signatureData = this.textEncoder.encode(signatureBase);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureArray,
      signatureData
    );

    if (!isValid) {
      throw new TokenInvalidError("Token signature verification failed");
    }

    // Decode and parse payload
    let payload: unknown;
    try {
      const payloadString = this.base64urlDecode(encodedPayload);
      payload = JSON.parse(payloadString);
    } catch {
      throw new TokenMalformedError("Failed to parse token payload");
    }

    // Validate payload structure with Zod
    const parseResult = tokenPayloadSchema.safeParse(payload);
    if (!parseResult.success) {
      throw new TokenMalformedError(
        `Invalid token payload structure: ${parseResult.error.message}`
      );
    }

    const validatedPayload = parseResult.data;

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (validatedPayload.exp < now) {
      throw new TokenExpiredError(
        `Token expired at ${new Date(
          validatedPayload.exp * 1000
        ).toISOString()}`
      );
    }

    return validatedPayload;
  }

  /**
   * Check if a token should be refreshed based on configured threshold
   * @param payload - The validated token payload
   * @returns True if token should be refreshed
   */
  static shouldRefreshToken(payload: TokenPayload): boolean {
    const cfg = config();
    const now = Math.floor(Date.now() / 1000);
    const tokenAge = now - payload.iat;
    const tokenLifetime = payload.exp - payload.iat;
    const ageRatio = tokenAge / tokenLifetime;

    return ageRatio >= cfg.TOKEN_REFRESH_THRESHOLD;
  }

  /**
   * Create a refreshed token with new timestamps but same user ID
   * @param oldPayload - The payload from the old token
   * @returns New signed JWT token
   */
  static async createRefreshedToken(oldPayload: TokenPayload): Promise<string> {
    // Create new token with same userId but fresh timestamps
    return await this.createToken(oldPayload.userId);
  }
}
