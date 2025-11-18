import { pgTable, uuid, varchar, pgEnum, index } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar({ length: 255 }).notNull(),
  firstName: varchar({ length: 100 }).notNull(),
  lastName: varchar({ length: 100 }).notNull(),
});

export const cardTypeEnum = pgEnum("card_type", ["visa", "mastercard", "amex"]);

export const cardsTable = pgTable("cards", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => usersTable.id),
  name: varchar({ length: 100 }).notNull(),
  type: cardTypeEnum().notNull(),
  last4: varchar({ length: 4 }).notNull(),
});
