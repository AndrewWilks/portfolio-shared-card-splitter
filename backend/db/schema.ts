import { boolean, pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { Card } from "@shared/entities/card.ts";
import { UserPreferences } from "@shared/entities/userPreferences.ts";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar({ length: 255 }).notNull(),
  firstName: varchar({ length: 100 }).notNull(),
  lastName: varchar({ length: 100 }).notNull(),
  hasOnboarded: boolean().notNull().default(false),
});

export const cardTypeEnum = pgEnum("card_type", Card.cardTypeEnumValues);
export const currencyEnum = pgEnum("currency", UserPreferences.currencyValues);

export const userPreferencesTable = pgTable("user_preferences", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .unique()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  notifications: boolean().notNull().default(true),
  darkMode: boolean().notNull().default(false),
  currency: currencyEnum().notNull().default("USD"),
});

export const cardsTable = pgTable("cards", {
  id: uuid().primaryKey().defaultRandom(),
  ownerId: uuid()
    .notNull()
    .references(() => usersTable.id),
  name: varchar({ length: 100 }).notNull(),
  type: cardTypeEnum().notNull(),
  last4: varchar({ length: 4 }).notNull(),
});
