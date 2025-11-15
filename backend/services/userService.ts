import { User, type TPassword } from "@shared/entities/user/index.ts";
import { ApiError } from "@shared/entities/api/apiError.ts";
import { UserRepository } from "../repositories/userRepository.ts";
import { hash, verify } from "@node-rs/argon2";

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
    const dbUser = await UserRepository.findById(userId);

    if (!dbUser) {
      return new ApiError({
        message: "User not found",
        code: ApiError.InternalCodes.USER_NOT_FOUND,
      });
    }

    // Transform database record to User entity
    return new User({
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
    });
  }

  /**
   * Get user by email
   * @param email - User email address
   * @returns User entity or ApiError
   */
  static async getUserByEmail(email: string): Promise<User | ApiError> {
    const dbUser = await UserRepository.findByEmail(email);

    if (!dbUser) {
      return new ApiError({
        message: "User not found",
        code: ApiError.InternalCodes.USER_NOT_FOUND,
      });
    }

    return new User({
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
    });
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
    const dbUser = await UserRepository.findByEmail(email);

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
}
