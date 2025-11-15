import { defineConfig } from "drizzle-kit";
import { config } from "./evnLoader.ts";

export default defineConfig({
  out: "./.drizzle",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: config().DATABASE_URL,
  },
});
