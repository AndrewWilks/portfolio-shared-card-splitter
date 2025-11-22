import { z } from "zod";
import { User } from "./index.ts";
import { UserPreferences } from "../userPreferences.ts";
import { Card } from "../card.ts";
import { ApiResponse } from "../api/apiResponse.ts";

export class UserOnboarding {
  // Schemas
  // API Request
  static get apiRequestDataSchema() {
    return z.object({
      firstName: User.firstNameSchema,
      lastName: User.lastNameSchema,
      preferences: z.object({
        notifications: UserPreferences.notificationsSchema,
        darkMode: UserPreferences.darkModeSchema,
        currency: UserPreferences.currencySchema,
      }),
      card: z.object({
        name: Card.nameSchema,
        type: Card.typeSchema,
        last4: Card.last4Schema,
      }).optional(),
    });
  }

  // API Response
  static get apiResponseDataSchema() {
    return z.object({
      user: User.schema,
      preferences: UserPreferences.schema,
      card: Card.schema,
    });
  }

  static parseApiRequestData(data: unknown) {
    return this.apiRequestDataSchema.parse(data);
  }

  static parseApiResponseData(data: unknown) {
    return this.apiResponseDataSchema.parse(data);
  }

  // deno-lint-ignore no-explicit-any
  static parseApiResponse(data: any) {
    return ApiResponse.parse(data, this.apiResponseDataSchema);
  }

  static parseApiRequest(data: unknown) {
    return this.apiRequestDataSchema.parse(data);
  }

  static createApiResponse(data: z.infer<typeof this.apiResponseDataSchema>) {
    return new ApiResponse({
      message: "User onboarding completed successfully",
      data: data,
    });
  }
}

export type TApiResponse = ReturnType<typeof UserOnboarding.createApiResponse>;
export type TApiRequest = ReturnType<typeof UserOnboarding.parseApiRequest>;
