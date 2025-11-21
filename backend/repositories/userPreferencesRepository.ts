import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import {
  DB_UserPreferences,
  DB_UserPreferencesCreate,
  DB_UserPreferencesKey,
  DB_UserPreferencesUpdate,
} from "../db/types.ts";
import { userPreferencesTable } from "../db/schema.ts";

/**
 * UserPreferencesRepository handles all database operations for user preferences
 * Follows the repository pattern for clean separation of data access
 */
export class UserPreferencesRepository {
  /**
   * Find preferences by ID
   * @param id - Preferences ID (UUID)
   * @returns Preferences record or null if not found
   */
  static async getById(
    id: DB_UserPreferencesKey,
  ): Promise<DB_UserPreferences | null> {
    const result = await db
      .select()
      .from(userPreferencesTable)
      .where(eq(userPreferencesTable.id, id))
      .limit(1);
    return result[0] ?? null;
  }

  /**
   * Find preferences by user ID
   * @param userId - User ID (UUID)
   * @returns Preferences record or null if not found
   */
  static async getByUserId(userId: string): Promise<DB_UserPreferences | null> {
    const result = await db
      .select()
      .from(userPreferencesTable)
      .where(eq(userPreferencesTable.userId, userId))
      .limit(1);
    return result[0] ?? null;
  }

  /**
   * Create new user preferences
   * @param data - Preferences data
   * @returns Created preferences record
   */
  static async create(
    data: DB_UserPreferencesCreate,
  ): Promise<DB_UserPreferences | null> {
    const result = await db.insert(userPreferencesTable).values(data)
      .returning();
    return result[0] ?? null;
  }

  /**
   * Update preferences by ID
   * @param id - Preferences ID (UUID)
   * @param data - Update data
   * @returns Updated preferences record
   */
  static async update(
    id: DB_UserPreferencesKey,
    data: DB_UserPreferencesUpdate,
  ): Promise<DB_UserPreferences | null> {
    const result = await db
      .update(userPreferencesTable)
      .set(data)
      .where(eq(userPreferencesTable.id, id))
      .returning();
    return result[0] ?? null;
  }

  /**
   * Update preferences by user ID
   * @param userId - User ID (UUID)
   * @param data - Update data
   * @returns Updated preferences record
   */
  static async updateByUserId(
    userId: string,
    data: DB_UserPreferencesUpdate,
  ): Promise<DB_UserPreferences | null> {
    const result = await db
      .update(userPreferencesTable)
      .set(data)
      .where(eq(userPreferencesTable.userId, userId))
      .returning();
    return result[0] ?? null;
  }

  /**
   * Delete preferences by ID
   * @param id - Preferences ID (UUID)
   * @returns true if deleted, false otherwise
   */
  static async delete(id: DB_UserPreferencesKey): Promise<boolean> {
    const result = await db
      .delete(userPreferencesTable)
      .where(eq(userPreferencesTable.id, id))
      .returning();
    return result.length > 0;
  }
}
