import * as schema from "./schema.ts";
import { InferSelectModel, InferInsertModel, InferEnum } from "drizzle-orm";

export type DB_User = InferSelectModel<typeof schema.usersTable>;
export type DB_NewUser = InferInsertModel<typeof schema.usersTable>;

export type DB_Card = InferSelectModel<typeof schema.cardsTable>;
export type DB_NewCard = InferInsertModel<typeof schema.cardsTable>;

export type DB_CardType = InferEnum<typeof schema.cardTypeEnum>;
