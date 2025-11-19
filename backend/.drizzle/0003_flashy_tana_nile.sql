ALTER TABLE "cards" RENAME COLUMN "owner" TO "ownerId";--> statement-breakpoint
ALTER TABLE "cards" DROP CONSTRAINT "cards_owner_users_id_fk";
--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;