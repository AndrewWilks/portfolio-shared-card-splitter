ALTER TABLE "cards" RENAME COLUMN "userId" TO "owner";--> statement-breakpoint
ALTER TABLE "cards" DROP CONSTRAINT "cards_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;