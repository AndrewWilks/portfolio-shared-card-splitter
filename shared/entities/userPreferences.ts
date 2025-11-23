import { z } from "zod";
import Entity from "./base/entity.ts";
import { User } from "./user/index.ts";
import { DB_UserPreferencesCreate } from "@backend/db/types.ts";

export type TCurrency = keyof typeof UserPreferences.currencyLabelMap;

export class UserPreferences extends Entity {
  public userId: string;
  public notifications: boolean;
  public darkMode: boolean;
  public currency: TCurrency;

  static readonly currencyValues = ["USD", "EUR", "GBP", "AUD"] as const;
  static readonly currencyLabelMap = {
    USD: "US Dollar",
    EUR: "Euro",
    GBP: "British Pound",
    AUD: "Australian Dollar",
  };

  constructor(data: DB_UserPreferencesCreate) {
    super({ id: data.id });
    this.userId = data.userId;
    this.notifications = data.notifications ?? true;
    this.darkMode = data.darkMode ?? false;
    this.currency = data.currency ?? "USD";
  }

  override toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      notifications: this.notifications,
      darkMode: this.darkMode,
      currency: this.currency,
    };
  }

  static get userIdSchema() {
    return User.idSchema.describe("User ID must be a valid UUID");
  }

  static get notificationsSchema() {
    return z.boolean().describe("Email notifications enabled/disabled");
  }

  static get darkModeSchema() {
    return z.boolean().describe("Dark mode enabled/disabled");
  }

  static get currencySchema() {
    return z.enum(this.currencyValues, { message: "Invalid currency code" });
  }

  static override get schema() {
    return super.schema.extend({
      userId: this.userIdSchema,
      notifications: this.notificationsSchema,
      darkMode: this.darkModeSchema,
      currency: this.currencySchema,
    });
  }

  static create(data: DB_UserPreferencesCreate): UserPreferences {
    const parsed = this.schema.parse(data);
    return new UserPreferences(parsed);
  }
}
