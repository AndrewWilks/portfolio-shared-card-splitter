import { enum as zEnum, string } from "zod";

import Entity from "./base/entity.ts";
import { User } from "./user/index.ts";
export type TCardType = keyof typeof Card.cardTypeLabelMap;

export class Card extends Entity {
  public ownerId: string;
  public name: string;
  public type: DB_CardType;
  public last4: string;

  static readonly cardTypeEnumValues = ["visa", "mastercard", "amex"] as const;

  static get cardTypeLabelMap() {
    return {
      visa: "Visa",
      mastercard: "Mastercard",
      amex: "American Express",
    };
  }

  constructor(data: DB_CardCreate) {
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

  static override get createSchema() {
    return super.createSchema.extend({
      ownerId: this.ownerIdSchema,
      name: this.nameSchema,
      type: this.typeSchema,
      last4: this.last4Schema,
    });
  }

  static override get updateSchema() {
    return super.updateSchema.extend({
      ownerId: this.ownerIdSchema.optional(),
      name: this.nameSchema.optional(),
      type: this.typeSchema.optional(),
      last4: this.last4Schema.optional(),
    });
  }

  static override get schema() {
    return super.schema.extend({
      ownerId: this.ownerIdSchema,
      name: this.nameSchema,
      type: this.typeSchema,
      last4: this.last4Schema,
    });
  }

  static create(data: DB_CardCreate): Card {
    return new Card(data);
  }
}
