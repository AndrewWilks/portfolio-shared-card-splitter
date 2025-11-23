import { enum as zEnum, infer as zInfer, string } from "zod";

import Entity from "./base/entity.ts";
import { User } from "./user/index.ts";
import { ApiResponse } from "./api/apiResponse.ts";

export type TCardType = keyof typeof Card.cardTypeLabelMap;
export type TCardSchema = zInfer<typeof Card.schema>;

export class Card extends Entity {
  public ownerId: string;
  public name: string;
  public type: TCardType;
  public last4: string;

  static readonly cardTypeEnumValues = ["visa", "mastercard", "amex"] as const;

  static get cardTypeLabelMap() {
    return {
      visa: "Visa",
      mastercard: "Mastercard",
      amex: "American Express",
    };
  }

  constructor(data: TCardSchema) {
    super({ id: data.id });
    this.ownerId = data.ownerId;
    this.name = data.name;
    this.type = data.type;
    this.last4 = data.last4;
  }

  override toJSON() {
    return {
      ownerId: this.ownerId,
      name: this.name,
      type: this.type,
      last4: this.last4,
      id: this.id,
    };
  }

  static get ownerIdSchema() {
    return User.idSchema.describe("Owner ID must be a valid UUID");
  }

  static get nameSchema() {
    return string()
      .min(1, "Name must be at least 1 character")
      .max(100, "Name must be at most 100 characters");
  }

  static get typeSchema() {
    return zEnum(this.cardTypeEnumValues, "Invalid card type");
  }

  static get last4Schema() {
    return string().length(4, "Last 4 must be exactly 4 characters");
  }

  static create(data: TCardSchema): Card {
    return new Card(data);
  }

  static override get schema() {
    return super.schema.extend({
      ownerId: this.ownerIdSchema,
      name: this.nameSchema,
      type: this.typeSchema,
      last4: this.last4Schema,
    });
  }

  // API Request Helpers
  static override get ApiCreateRequestSchema() {
    return this.schema.omit({ id: true, ownerId: true });
  }

  static override parseSingleResponse(data: unknown) {
    return ApiResponse.parse(data, this.schema);
  }

  static override parseArrayResponse(data: unknown) {
    return ApiResponse.parse(data, this.schema.array());
  }

  static override createSingleResponse(
    card: Card,
    message = "Card retrieved successfully",
  ) {
    return new ApiResponse({
      data: card.toJSON(),
      message,
    });
  }

  static override createArrayResponse(
    cards: Card[],
    message = "Cards retrieved successfully",
  ) {
    return new ApiResponse({
      data: cards.map((card) => card.toJSON()),
      message,
    });
  }
}

export type TCardArrayResponse = ReturnType<typeof Card.createArrayResponse>;
export type TCardSingleResponse = ReturnType<typeof Card.createSingleResponse>;
