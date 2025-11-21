import * as schema from "./schema.ts";
import { InferEnum, InferInsertModel, InferSelectModel } from "drizzle-orm";

export type DB_User = InferSelectModel<typeof schema.usersTable>;
export type DB_UserKey = DB_User["id"];
export type DB_UserCreate = Omit<
  InferInsertModel<typeof schema.usersTable>,
  "hasOnboarded" | "id"
>;
export type DB_UserUpdate = Partial<Omit<DB_User, "id" | "hasOnboarded">>;

export type DB_Card = InferSelectModel<typeof schema.cardsTable>;
export type DB_CardKey = DB_Card["id"];
export type DB_CardType = InferEnum<typeof schema.cardTypeEnum>;
export type DB_CardCreate = InferInsertModel<typeof schema.cardsTable>;
export type DB_CardUpdate = Partial<Omit<DB_Card, "id">>;

export type DB_UserPreferences = InferSelectModel<
  typeof schema.userPreferencesTable
>;
export type DB_UserPreferencesCreate = InferInsertModel<
  typeof schema.userPreferencesTable
>;
export type DB_UserPreferencesUpdate = Partial<Omit<DB_UserPreferences, "id">>;
export type DB_UserPreferencesKey = DB_UserPreferences["id"];
export type DB_Currency = DB_UserPreferences["currency"];
