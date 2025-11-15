-- Drop the existing users table and recreate with UUID
DROP TABLE IF EXISTS "users" CASCADE;

-- Create users table with UUID primary key
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"passwordHash" varchar(255) NOT NULL,
	"firstName" varchar(100) NOT NULL,
	"lastName" varchar(100) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
