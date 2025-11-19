import * as schema from "./schema.ts";
import { InferSelectModel, InferInsertModel, InferEnum } from "drizzle-orm";

export type DB_User = InferSelectModel<typeof schema.usersTable>;
export type DB_UserKey = DB_User["id"];
export type DB_UserCreate = InferInsertModel<typeof schema.usersTable>;
export type DB_UserUpdate = Partial<Omit<DB_User, "id">>;

export type DB_Card = InferSelectModel<typeof schema.cardsTable>;
export type DB_CardKey = DB_Card["id"];
export type DB_CardType = InferEnum<typeof schema.cardTypeEnum>;
export type DB_CardCreate = InferInsertModel<typeof schema.cardsTable>;
export type DB_CardUpdate = Partial<Omit<DB_Card, "id">>;
