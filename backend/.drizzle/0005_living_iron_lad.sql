CREATE TYPE "public"."currency" AS ENUM('USD', 'EUR', 'GBP', 'AUD');--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"notifications" boolean DEFAULT true NOT NULL,
	"darkMode" boolean DEFAULT false NOT NULL,
	"currency" "currency" DEFAULT 'USD' NOT NULL,
	CONSTRAINT "user_preferences_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;