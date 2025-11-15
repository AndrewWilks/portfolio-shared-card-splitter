import { User, type TPassword } from "@shared/entities/user/index.ts";
import { ApiError } from "@shared/entities/api/apiError.ts";
import { UserRepository } from "../repositories/userRepository.ts";

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
   * Hash a password using a secure hashing algorithm
   * @param password - Plain text password
   * @returns Hashed password string
   */
  static async hashPassword(password: TPassword): Promise<TPassword> {
    const parsed = User.passwordSchema.parse(password);

    // Convert password to Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(parsed);

    // Hash using SHA-256
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  }

  /**
   * Verify a password against a hash
   * @param password - Plain text password
   * @param hash - Hashed password to compare against
   * @returns True if password matches hash
   */
  static async verifyPassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }
}
