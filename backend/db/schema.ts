import { pgTable, uuid, varchar, pgEnum, boolean } from "drizzle-orm/pg-core";
import { cardTypeEnumValues } from "./constants.ts";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar({ length: 255 }).notNull(),
  firstName: varchar({ length: 100 }).notNull(),
  lastName: varchar({ length: 100 }).notNull(),
  hasOnboarded: boolean().notNull().default(false),
});

export const cardTypeEnum = pgEnum("card_type", cardTypeEnumValues);

export const cardsTable = pgTable("cards", {
  id: uuid().primaryKey().defaultRandom(),
  ownerId: uuid()
    .notNull()
    .references(() => usersTable.id),
  name: varchar({ length: 100 }).notNull(),
  type: cardTypeEnum().notNull(),
  last4: varchar({ length: 4 }).notNull(),
});
