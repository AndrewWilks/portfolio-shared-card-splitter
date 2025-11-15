import { User } from "@shared/entities/user/index.ts";
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
}
