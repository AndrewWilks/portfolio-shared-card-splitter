import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { config } from "../.config/evnLoader.ts";

const { Pool } = pg;

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: config().DATABASE_URL,
});

// Create drizzle instance with the pool
const db = drizzle(pool);

export { db, pool };
