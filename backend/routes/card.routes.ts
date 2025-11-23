import { STATUS_CODE } from "@std/http";
import { createFactory } from "hono/factory";

// Entities and Types
import { ApiError, type TApiError } from "@shared/entities/api/apiError.ts";
import { ApiResponse } from "@shared/entities/api/apiResponse.ts";

// Services
import { CardService } from "../services/cardService.ts";

const factory = createFactory();

/**
 * GET /api/v1/cards
 * Get all cards owned by the authenticated user
 */
export const getCards = factory.createHandlers(async (c) => {
  const user = c.get("user");

  const response = await CardService.getCardsByOwner(user.userId);

  if (response instanceof ApiError) {
    return c.json(response, CardService.mapErrorToStatusCode(response));
  }

  return c.json(response, STATUS_CODE.OK);
});

/**
 * POST /api/v1/cards
 * Create a new card for the authenticated user
 */
export const createCard = factory.createHandlers(async (c) => {
  const user = c.get("user");
  const json = await c.req.json();

  const cardData = {
    ...json,
    ownerId: user.userId,
  };

  const response = await CardService.createCard(cardData);

  if (response instanceof ApiError) {
    return c.json(response, CardService.mapErrorToStatusCode(response));
  }

  return c.json(response, STATUS_CODE.Created);
});

/**
 * GET /api/v1/cards/:id
 * Get a specific card by ID for the authenticated user
 */
export const getCardById = factory.createHandlers(async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");

  if (!id) {
    const error = new ApiError({
      message: "Card ID is required",
      code: ApiError.InternalCodes.INVALID_CARD_ID,
    });
    return c.json(error, STATUS_CODE.BadRequest);
  }

  const response = await CardService.getCardById(id);

  if (response instanceof ApiError) {
    return c.json(response, CardService.mapErrorToStatusCode(response));
  }

  // Check ownership - access response.data for the card
  if (!response.data || response.data.ownerId !== user.userId) {
    const errorData: TApiError = {
      message: "Unauthorised access to card",
      code: ApiError.InternalCodes.INVALID_CARD_OWNER_ID,
    };
    return c.json(new ApiError(errorData), STATUS_CODE.Unauthorized);
  }

  return c.json(response, STATUS_CODE.OK);
});

/**
 * POST /api/v1/cards/:id
 * Update a specific card by ID for the authenticated user
 */
export const updateCardById = factory.createHandlers(async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const json = await c.req.json();
  if (!id) {
    const error = new ApiError({
      message: "Card ID is required",
      code: ApiError.InternalCodes.INVALID_CARD_ID,
    });
    return c.json(error, STATUS_CODE.BadRequest);
  }

  // Check if card exists and user owns it
  const existingCardResponse = await CardService.getCardById(id);

  if (existingCardResponse instanceof ApiError) {
    return c.json(
      existingCardResponse,
      CardService.mapErrorToStatusCode(existingCardResponse),
    );
  }

  if (existingCardResponse.data!.ownerId !== user.userId) {
    const errorData: TApiError = {
      message: "Unauthorised access to card",
      code: ApiError.InternalCodes.INVALID_CARD_OWNER_ID,
    };
    return c.json(new ApiError(errorData), STATUS_CODE.Unauthorized);
  }

  const response = await CardService.updateCard(id, json);

  if (response instanceof ApiError) {
    return c.json(response, CardService.mapErrorToStatusCode(response));
  }

  return c.json(response, STATUS_CODE.OK);
});

/**
 * DELETE /api/v1/cards/:id
 * Delete a specific card by ID for the authenticated user
 */
export const deleteCardById = factory.createHandlers(async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");

  if (!id) {
    const error = new ApiError({
      message: "Card ID is required",
      code: ApiError.InternalCodes.INVALID_CARD_ID,
    });
    return c.json(error, STATUS_CODE.BadRequest);
  }

  // Check if card exists and user owns it
  const existingCardResponse = await CardService.getCardById(id);

  if (existingCardResponse instanceof ApiError) {
    return c.json(
      existingCardResponse,
      CardService.mapErrorToStatusCode(existingCardResponse),
    );
  }

  if (existingCardResponse.data!.ownerId !== user.userId) {
    const errorData: TApiError = {
      message: "Unauthorised access to card",
      code: ApiError.InternalCodes.INVALID_CARD_OWNER_ID,
    };
    return c.json(new ApiError(errorData), STATUS_CODE.Unauthorized);
  }

  const deletedCard = await CardService.deleteCard(id);

  if (deletedCard instanceof ApiError) {
    return c.json(deletedCard, CardService.mapErrorToStatusCode(deletedCard));
  }

  return c.json(
    new ApiResponse({
      data: deletedCard,
      message: "Card deleted successfully",
    }),
    STATUS_CODE.OK,
  );
});
