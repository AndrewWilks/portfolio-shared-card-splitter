import { z } from "zod";

// Define individual schemas for each environment variable
const envSchema = z.object({
  // Database configuration
  // Supports both pglite file paths (./data/db.pglite) and PostgreSQL URLs
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine(
      (val) => {
        // Allow pglite file paths or valid PostgreSQL URLs
        const isFilePath = val.startsWith("./") || val.startsWith("../") ||
          val.startsWith("/") || /^[a-zA-Z]:\\/.test(val);
        const isUrl = val.startsWith("postgresql://") ||
          val.startsWith("postgres://");
        return isFilePath || isUrl;
      },
      "DATABASE_URL must be a pglite file path or a valid PostgreSQL URL",
    ),

  // Session/Auth configuration
  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET must be at least 32 characters for security")
    .default(() => {
      const env = Deno.env.get("ENV");
      if (env === "production") {
        throw new Error("SESSION_SECRET is required in production environment");
      }
      console.warn(
        "⚠️  SESSION_SECRET not set, using generated value (NOT FOR PRODUCTION)"
      );
      return crypto.randomUUID() + crypto.randomUUID();
    }),

  // Environment mode
  ENV: z.enum(["development", "production", "test"]).default("development"),

  // Server configuration
  PORT: z
    .string()
    .default("8000")
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(65535)),

  CORS_ORIGIN: z
    .url("CORS_ORIGIN must be a valid URL")
    .default("http://localhost:3000"),

  SESSION_MAX_AGE: z
    .string()
    .default("86400")
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive()),
});

// Infer the TypeScript type from the schema
export type Config = z.infer<typeof envSchema>;

class EnvLoader {
  private static instance: EnvLoader | null = null;
  private readonly config: Config;

  private constructor() {
    this.config = this.loadAndValidate();
  }

  /**
   * Get the singleton instance of EnvLoader
   */
  public static getInstance(): EnvLoader {
    if (!EnvLoader.instance) {
      EnvLoader.instance = new EnvLoader();
    }
    return EnvLoader.instance;
  }

  /**
   * Load and validate environment variables
   */
  private loadAndValidate(): Config {
    try {
      // Gather all environment variables
      const rawEnv = {
        DATABASE_URL: Deno.env.get("DATABASE_URL"),
        SESSION_SECRET: Deno.env.get("SESSION_SECRET"),
        ENV: Deno.env.get("ENV"),
        PORT: Deno.env.get("PORT"),
        CORS_ORIGIN: Deno.env.get("CORS_ORIGIN"),
        SESSION_MAX_AGE: Deno.env.get("SESSION_MAX_AGE"),
      };

      // Parse and validate with Zod
      const validated = envSchema.parse(rawEnv);

      return validated;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("❌ Environment variable validation failed:");
        error.issues.forEach((issue) => {
          console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
        });
        throw new Error(
          "Environment validation failed. Please check your environment variables."
        );
      }
      throw error;
    }
  }

  /**
   * Get the validated configuration object
   */
  public getConfig(): Readonly<Config> {
    return Object.freeze({ ...this.config });
  }
}

/**
 * Get the validated environment configuration
 * Use this function throughout your application to access config values
 */
export const config = (): Readonly<Config> => {
  return EnvLoader.getInstance().getConfig();
};
