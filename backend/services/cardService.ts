import { Card } from "@shared/entities/card.ts";

import { ApiError } from "@shared/entities/api/apiError.ts";
import { STATUS_CODE } from "@std/http";
import { CardRepository } from "@backend/repositories/cardRepository.ts";
import { DB_CardCreate, DB_CardKey, DB_CardUpdate } from "@backend/db/types.ts";
// TODO: Add api rollback strategy like the onboardingService
/**
 * CardService handles business logic related to cards
 * Sits between routes and repository for validation and transformation
 */
export class CardService {
  /**
   * Get card by ID with proper error handling
   * @param id - Card ID (UUID)
   * @returns Card entity or ApiError
   */
  static async getCardById(id: DB_CardKey): Promise<Card | ApiError> {
    const parsed = Card.idSchema.safeParse(id);
    if (!parsed.success) {
      return new ApiError({
        message: "Invalid card ID",
        code: ApiError.InternalCodes.INVALID_CARD_DATA,
        details: parsed.error.issues.toString(),
      });
    }

    const dbCard = await CardRepository.getById(id);

    if (!dbCard) {
      return new ApiError({
        message: "Card not found",
        code: ApiError.InternalCodes.CARD_NOT_FOUND,
      });
    }

    return Card.create(dbCard);
  }

  /**
   * Get all cards owned by a specific user
   * @param ownerId - Owner user ID (UUID)
   * @returns Array of Card entities or ApiError
   */
  static async getCardsByOwner(ownerId: string): Promise<Card[] | ApiError> {
    const parsed = Card.ownerIdSchema.safeParse(ownerId);
    if (!parsed.success) {
      return new ApiError({
        message: "Invalid owner ID",
        code: ApiError.InternalCodes.INVALID_CARD_OWNER_ID,
        details: parsed.error.issues.toString(),
      });
    }
    const dbCards = await CardRepository.getByOwner(ownerId);

    return dbCards.map((dbCard) => Card.create(dbCard));
  }

  /**
   * Create a new card with validation
   * @param data - Card creation data
   * @returns Created Card entity or ApiError
   */
  static async createCard(data: DB_CardCreate): Promise<Card | ApiError> {
    // Validate input data using Card entity's createSchema
    const parseResult = Card.createSchema.safeParse(data);

    if (!parseResult.success) {
      return new ApiError({
        message: "Invalid card data",
        code: ApiError.InternalCodes.INVALID_CARD_DATA,
        details: parseResult.error.issues.toString(),
      });
    }

    // Create the card in the database
    const dbCard = await CardRepository.create(data);

    if (!dbCard) {
      return new ApiError({
        message: "Failed to create card",
        code: ApiError.InternalCodes.CARD_CREATION_FAILED,
      });
    }

    return Card.create(dbCard);
  }

  /**
   * Update an existing card with validation
   * @param id - Card ID (UUID)
   * @param data - Card update data
   * @returns Updated Card entity or ApiError
   */
  static async updateCard(
    id: DB_CardKey,
    data: DB_CardUpdate,
  ): Promise<Card | ApiError> {
    // Validate input data using Card entity's updateSchema
    const parseResult = Card.updateSchema.safeParse(data);
    if (!parseResult.success) {
      return new ApiError({
        message: "Invalid card data",
        code: ApiError.InternalCodes.INVALID_CARD_DATA,
        details: parseResult.error.issues.toString(),
      });
    }
    const dbCard = await CardRepository.update(id, data);
    if (!dbCard) {
      return new ApiError({
        message: "Card not found",
        code: ApiError.InternalCodes.CARD_NOT_FOUND,
      });
    }
    return Card.create(dbCard);
  }

  /**
   * Delete a card by ID with proper error handling
   * @param id - Card ID (UUID)
   * @returns true if deleted, or ApiError
   */
  static async deleteCard(id: DB_CardKey): Promise<boolean | ApiError> {
    const deleted = await CardRepository.delete(id);
    if (deleted === false) {
      return new ApiError({
        message: "Card not found",
        code: ApiError.InternalCodes.CARD_NOT_FOUND,
      });
    }
    return deleted;
  }

  /**
   * Check if a user has any cards
   * @param userId - Owner user ID (UUID)
   * @returns true if user has cards, false otherwise, or ApiError
   */
  static async hasCards(userId: string): Promise<boolean | ApiError> {
    const parsed = Card.ownerIdSchema.safeParse(userId);
    if (!parsed.success) {
      return new ApiError({
        message: "Invalid owner ID",
        code: ApiError.InternalCodes.INVALID_CARD_OWNER_ID,
        details: parsed.error.issues.toString(),
      });
    }

    const dbCards = await CardRepository.getByOwner(userId);
    return dbCards.length > 0;
  }

  static mapErrorToStatusCode(error: ApiError) {
    switch (error.code) {
      case ApiError.InternalCodes.INVALID_CARD_DATA:
      case ApiError.InternalCodes.INVALID_CARD_OWNER_ID:
      case ApiError.InternalCodes.INVALID_CARD_ID:
        return STATUS_CODE.BadRequest; // Bad Request

      case ApiError.InternalCodes.CARD_NOT_FOUND:
        return STATUS_CODE.NotFound; // Not Found

      case ApiError.InternalCodes.CARD_CREATION_FAILED:
        return STATUS_CODE.InternalServerError; // Internal Server Error

      default:
        return STATUS_CODE.InternalServerError; // Internal Server Error for unknown codes
    }
  }
}
