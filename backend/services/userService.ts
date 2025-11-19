import { User, type TPassword } from "@shared/entities/user/index.ts";
import { ApiError } from "@shared/entities/api/apiError.ts";
import { UserRepository } from "../repositories/userRepository.ts";
import { hash, verify } from "@node-rs/argon2";
import { STATUS_CODE } from "@std/http";

// TODO: Move the Auth services to a separate AuthService file and class

/**
 * UserService handles business logic for user operations
 * Sits between routes and repository for validation and transformation
 */
export class UserService {
  /**
   * Get user by ID with proper error handling
   * @param userId - User ID (UUID from token)
   * @returns User entity or ApiError
   */
  static async getUserById(userId: string): Promise<User | ApiError> {
    // Fetch from database
    const dbUser = await UserRepository.getById(userId);

    if (!dbUser) {
      return new ApiError({
        message: "User not found",
        code: ApiError.InternalCodes.USER_NOT_FOUND,
      });
    }

    // Transform database record to User entity
    return User.create(dbUser);
  }

  /**
   * Get user by email
   * @param email - User email address
   * @returns User entity or ApiError
   */
  static async getUserByEmail(email: string): Promise<User | ApiError> {
    const dbUser = await UserRepository.getByEmail(email);

    if (!dbUser) {
      return new ApiError({
        message: "User not found",
        code: ApiError.InternalCodes.USER_NOT_FOUND,
      });
    }

    return User.create(dbUser);
  }

  /**
   * Hash a password using Argon2id (OWASP 2025 standard)
   * @param password - Plain text password
   * @returns Hashed password string (Argon2id format)
   */
  static async hashPassword(password: TPassword): Promise<string> {
    const parsed = User.passwordSchema.parse(password);

    // Hash using Argon2id with OWASP recommended parameters
    return await hash(parsed, {
      memoryCost: 19456, // 19 MiB
      timeCost: 2, // 2 iterations
      parallelism: 1, // 1 thread
      outputLen: 32, // 32 bytes
    });
  }

  /**
   * Legacy SHA-256 password hashing (for migration only)
   * @deprecated Use hashPassword() for new hashes
   * @param password - Plain text password
   * @returns SHA-256 hash string
   */
  private static async legacyHashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  /**
   * Verify a password with automatic migration from SHA-256 to Argon2id
   * @param email - User email for database lookup
   * @param password - Plain text password to verify
   * @returns True if password matches, false otherwise
   */
  static async verifyPassword(
    email: string,
    password: string
  ): Promise<boolean> {
    const dbUser = await UserRepository.getByEmail(email);

    if (!dbUser) {
      return false;
    }

    // Detect legacy SHA-256 hash (64 hex characters)
    if (/^[a-f0-9]{64}$/i.test(dbUser.passwordHash)) {
      // Verify old SHA-256 hash
      const oldHash = await this.legacyHashPassword(password);

      if (oldHash !== dbUser.passwordHash) {
        return false;
      }

      // UPGRADE: Migrate to Argon2id on successful login
      const newHash = await this.hashPassword(password);
      await UserRepository.update(dbUser.id, { passwordHash: newHash });

      console.log(`✓ Migrated user ${email} from SHA-256 to Argon2id`);
      return true;
    }

    // Verify Argon2id hash
    try {
      return await verify(dbUser.passwordHash, password);
    } catch (error) {
      console.error(`Password verification error for ${email}:`, error);
      return false;
    }
  }

  /**
   * Onboard a user by marking them as having completed onboarding
   * @param userId - User ID to onboard
   * @returns Updated User entity or ApiError
   */
  static async onboardUser(userId: string): Promise<User | ApiError> {
    const parsedUserId = User.idSchema.safeParse(userId);

    if (!parsedUserId.success) {
      return new ApiError({
        message: "Invalid user ID format",
        code: ApiError.InternalCodes.INVALID_USER_ID,
      });
    }

    const dbUser = await UserRepository.onboardUser(userId);

    if (!dbUser) {
      return new ApiError({
        message: "User not found for onboarding",
        code: ApiError.InternalCodes.USER_NOT_FOUND,
      });
    }

    return User.create(dbUser);
  }

  static mapErrorToStatusCode(error: ApiError) {
    switch (error.code) {
      case ApiError.InternalCodes.USER_NOT_FOUND:
        return STATUS_CODE.NotFound; // Not Found
      case ApiError.InternalCodes.USER_ALREADY_EXISTS:
        return STATUS_CODE.Conflict; // Conflict
      case ApiError.InternalCodes.INVALID_USER_DATA:
      case ApiError.InternalCodes.USER_CREATION_FAILED:
      case ApiError.InternalCodes.INVALID_USER_ID:
        return STATUS_CODE.BadRequest; // Bad Request
      default:
        return STATUS_CODE.InternalServerError; // Internal Server Error
    }
  }
}
