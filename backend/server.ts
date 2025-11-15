import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

// Routes
import * as bootstrapRoutes from "./routes/bootstrap.routes.ts";
import * as authRoutes from "./routes/auth.routes.ts";

// Middleware
import { requireAuth } from "./middleware/auth.ts";

// Config
import { config } from "./.config/evnLoader.ts";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: config().CORS_ORIGIN,
    credentials: true,
  })
);

app.use("*", logger());
app.get("/api", (c) => c.text("Hello Deno!"));
// =============================================================
// Public routes (no authentication required)
// =============================================================
app.get("/api/v1/bootstrap/status", bootstrapRoutes.getBootstrapStatus);
app.post("/api/v1/bootstrap", ...bootstrapRoutes.createBootstrap);
app.post("/api/v1/auth/login", ...authRoutes.login);

// =============================================================
// Apply authentication middleware to all /api/v1/*
// =============================================================
app.use("/api/v1/*", requireAuth());
// =============================================================
// Protected routes (authentication required)
// =============================================================
app.post("/api/v1/auth/logout", authRoutes.logout);
app.get("/api/v1/auth/me", authRoutes.me);
// =============================================================
// Add a catch-all to see what's being requested
// =============================================================
app.all("*", (c) => {
  console.log("Unhandled request:", c.req.url);
  return c.text("Not Found", 404);
});
// =============================================================

Deno.serve({ port: 8000 }, app.fetch);
