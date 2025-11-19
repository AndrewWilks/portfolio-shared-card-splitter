import { eq } from "drizzle-orm";
import { db } from "../db/index.ts";
import {
  DB_Card,
  DB_CardCreate,
  DB_CardUpdate,
  DB_CardKey,
} from "../db/types.ts";
import { cardsTable } from "../db/schema.ts";

/**
 * CardRepository handles all database operations for cards
 * Follows the repository pattern for clean separation of data access
 */
export class CardRepository {
  /**
   * Find a card by its ID
   * @param id - Card ID (UUID)
   * @returns Card record or null if not found
   */
  static async getById(id: DB_CardKey): Promise<DB_Card | null> {
    const result = await db
      .select()
      .from(cardsTable)
      .where(eq(cardsTable.id, id))
      .limit(1);
    return result[0] ?? null;
  }

  /**
   * Find all cards owned by a specific user
   * @param owner - Owner user ID (UUID)
   * @returns Array of card records
   */
  static async getByOwner(ownerId: DB_Card["ownerId"]): Promise<DB_Card[]> {
    const result = await db
      .select()
      .from(cardsTable)
      .where(eq(cardsTable.ownerId, ownerId));
    return result;
  }

  /**
   * Create a new card
   * @param data - Card data
   * @returns Created card record
   */
  static async create(data: DB_CardCreate): Promise<DB_Card | null> {
    const result = await db.insert(cardsTable).values(data).returning();
    return result[0] ?? null;
  }

  static async update(
    id: DB_CardKey,
    data: DB_CardUpdate
  ): Promise<DB_Card | null> {
    const result = await db
      .update(cardsTable)
      .set(data)
      .where(eq(cardsTable.id, id))
      .returning();
    return result[0] ?? null;
  }

  static async delete(id: DB_CardKey): Promise<boolean> {
    const result = await db
      .delete(cardsTable)
      .where(eq(cardsTable.id, id))
      .returning();
    return result.length > 0;
  }
}
