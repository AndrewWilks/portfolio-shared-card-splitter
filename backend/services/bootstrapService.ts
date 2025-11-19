import { User } from "@shared/entities/user/index.ts";
import { ApiError } from "@shared/entities/api/apiError.ts";
import { ApiResponse } from "@shared/entities/api/apiResponse.ts";
import { UserRepository } from "../repositories/userRepository.ts";
import { UserService } from "./userService.ts";

/**
 * BootstrapService handles initial system setup
 * Used to create the first user when the database is empty
 */
export class BootstrapService {
  /**
   * Check if the system has been bootstrapped (has at least one user)
   * @returns True if system is bootstrapped, false otherwise
   */
  static async isBootstrapped(): Promise<boolean> {
    const users = await UserRepository.getAll();
    return users !== null && users.length > 0;
  }

  /**
   * Bootstrap the system by creating the first user
   * @param email - User email
   * @param password - Plain text password (will be hashed)
   * @param firstName - User first name
   * @param lastName - User last name
   * @returns Created User entity or ApiError
   */
  static async bootstrapFirstUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<ApiResponse<User> | ApiError> {
    // Check if system is already bootstrapped
    const alreadyBootstrapped = await this.isBootstrapped();
    if (alreadyBootstrapped) {
      return new ApiError({
        message: "System has already been bootstrapped",
        code: ApiError.InternalCodes.SYSTEM_ALREADY_BOOTSTRAPPED,
      });
    }

    // Hash the password
    const passwordHash = await UserService.hashPassword(password);

    // Create the user in the database
    const dbUser = await UserRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
    });

    if (!dbUser) {
      return new ApiError({
        message: "Failed to create first user",
        code: ApiError.InternalCodes.INVALID_BOOTSTRAP_DATA,
      });
    }

    const user = new User({
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
    });

    // Return as User entity
    return new ApiResponse<User>({
      data: user,
      message: "System bootstrapped successfully",
    });
  }
}
