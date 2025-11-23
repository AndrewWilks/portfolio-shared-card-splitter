import { Card } from "@shared/entities/card.ts";
import { ApiError } from "@shared/entities/api/apiError.ts";

/**
 * CardService handles frontend card-related API operations
 * Provides methods to fetch, create, and update cards
 */
export class CardService {
  private static readonly BASE_URL = "/api/v1/cards";

  /**
   * Get all cards for the authenticated user
   * @returns Array of Card entities or ApiError
   */
  static async getCards(): Promise<Card[] | ApiError> {
    try {
      const response = await fetch(this.BASE_URL, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        // Simple error handling - just return the error data as ApiError
        return new ApiError(data);
      }

      // Parse the API response using Card entity helper
      const parsed = Card.parseArrayResponse(data);
      // Map the raw data to Card instances
      const cards = (parsed.data || []).map((cardData) =>
        Card.create(cardData)
      );
      return cards;
    } catch (error) {
      return new ApiError({
        message: "Failed to fetch cards",
        code: ApiError.InternalCodes.CARD_NOT_FOUND,
        details: (error as Error).message,
      });
    }
  }

  /**
   * Create a new card
   * @param cardData - Card creation data (name, type, last4)
   * @returns Created Card entity or ApiError
   */
  static async createCard(cardData: {
    name: string;
    type: string;
    last4: string;
  }): Promise<Card | ApiError> {
    try {
      // Validate request data using Card entity helper
      Card.ApiCreateRequestSchema.parse(cardData);

      const response = await fetch(this.BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(cardData),
      });

      const data = await response.json();

      if (!response.ok) {
        return new ApiError(data);
      }

      // Parse the API response using Card entity helper
      const parsed = Card.parseSingleResponse(data);
      if (!parsed.data) {
        return new ApiError({
          message: "Invalid response from server",
          code: ApiError.InternalCodes.INVALID_CARD_DATA,
        });
      }
      return Card.create(parsed.data);
    } catch (error) {
      if (error instanceof ApiError) {
        return error;
      }
      return new ApiError({
        message: "Failed to create card",
        code: ApiError.InternalCodes.CARD_NOT_FOUND,
        details: (error as Error).message,
      });
    }
  }

  /**
   * Update an existing card
   * @param id - Card ID
   * @param cardData - Partial card update data
   * @returns Updated Card entity or ApiError
   */
  static async updateCard(
    id: string,
    cardData: Partial<{
      name: string;
      type: string;
      last4: string;
    }>,
  ): Promise<Card | ApiError> {
    try {
      // Validate request data using Card entity helper
      Card.ApiCreateRequestSchema.parse(cardData);

      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(cardData),
      });

      const data = await response.json();

      if (!response.ok) {
        return new ApiError(data);
      }

      // Parse the API response using Card entity helper
      const parsed = Card.parseSingleResponse(data);
      if (!parsed.data) {
        return new ApiError({
          message: "Invalid response from server",
          code: ApiError.InternalCodes.INVALID_CARD_DATA,
        });
      }
      return Card.create(parsed.data);
    } catch (error) {
      if (error instanceof ApiError) {
        return error;
      }
      return new ApiError({
        message: "Failed to update card",
        code: ApiError.InternalCodes.CARD_NOT_FOUND,
        details: (error as Error).message,
      });
    }
  }
}
