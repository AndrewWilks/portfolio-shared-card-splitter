import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import {
  DB_User,
  DB_UserCreate,
  DB_UserUpdate,
  DB_UserKey,
} from "../db/types.ts";
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
  static async getById(id: DB_UserKey): Promise<DB_User | null> {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    return result[0] ?? null;
  }

  /**
   * Find a user by their email address
   * @param email - User email address
   * @returns User record or undefined if not found
   */
  static async getByEmail(email: DB_User["email"]): Promise<DB_User | null> {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    return result[0] ?? null;
  }

  /**
   * Find all users (for bootstrap check)
   * @returns Array of user records
   */
  static async getAll(): Promise<DB_User[] | null> {
    const result = await db.select().from(usersTable);
    return result.length > 0 ? result : null;
  }

  /**
   * Mark a user as having completed onboarding
   * @param id - User ID to onboard
   * @returns Updated user record or null if not found
   */
  static async onboardUser(id: DB_UserKey): Promise<DB_User | null> {
    const result = await db
      .update(usersTable)
      .set({ hasOnboarded: true })
      .where(eq(usersTable.id, id))
      .returning();
    return result[0] ?? null;
  }

  /**
   * Mark a user as having offboarded
   * @param id - User ID to offboard
   * @returns Updated user record or null if not found
   */
  static async offboardUser(id: DB_UserKey): Promise<DB_User | null> {
    const result = await db
      .update(usersTable)
      .set({ hasOnboarded: false })
      .where(eq(usersTable.id, id))
      .returning();
    return result[0] ?? null;
  }

  /**
   * Create a new user
   * @param data - User data (email, passwordHash, firstName, lastName)
   * @returns Created user record
   */
  static async create(data: DB_UserCreate): Promise<DB_User | null> {
    const result = await db.insert(usersTable).values(data).returning();
    return result[0] ?? null;
  }

  /**
   * Update a user by ID
   * @param id - User ID to update
   * @param data - Partial user data to update
   * @returns Updated user record or undefined if not found
   */
  static async update(
    id: DB_UserKey,
    data: DB_UserUpdate
  ): Promise<DB_User | null> {
    const result = await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning();

    return result[0] ?? null;
  }

  /**
   * Delete a user by ID
   * @param id - User ID to delete
   * @returns Deleted user record or undefined if not found
   */
  static async delete(id: DB_UserKey): Promise<boolean> {
    const result = await db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();
    return result.length > 0;
  }
}
