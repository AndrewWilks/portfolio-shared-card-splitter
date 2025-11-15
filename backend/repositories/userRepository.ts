import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import { usersTable } from "../db/schema.ts";

/**
 * UserRepository handles all database operations for users
 * Follows the repository pattern for clean separation of data access
 */
export class UserRepository {
  /**
   * Find a user by their ID
   * @param id - User ID (UUID)
   * @returns User record or undefined if not found
   */
  static async findById(id: string) {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    return result[0];
  }

  /**
   * Find a user by their email address
   * @param email - User email address
   * @returns User record or undefined if not found
   */
  static async findByEmail(email: string) {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    return result[0];
  }

  /**
   * Create a new user
   * @param data - User data (email, passwordHash, firstName, lastName)
   * @returns Created user record
   */
  static async create(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
  }) {
    const result = await db.insert(usersTable).values(data).returning();
    return result[0];
  }

  /**
   * Find all users (for bootstrap check)
   * @returns Array of user records
   */
  static async findAll() {
    const result = await db.select().from(usersTable);
    return result;
  }

  /**
   * Update a user by ID
   * @param id - User ID to update
   * @param data - Partial user data to update
   * @returns Updated user record or undefined if not found
   */
  static async update(
    id: string,
    data: Partial<{
      email: string;
      passwordHash: string;
      firstName: string;
      lastName: string;
    }>
  ) {
    const result = await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning();

    return result[0];
  }

  /**
   * Delete a user by ID
   * @param id - User ID to delete
   * @returns Deleted user record or undefined if not found
   */
  static async delete(id: string) {
    const result = await db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();

    return result[0];
  }
}
