import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("*", logger());

app.get("/api", (c) => c.text("Hello Deno!"));

app.get("/api/v1/bootstrap/status", (c) => {
  // In a real application, replace this with actual bootstrap status check
  // TODO: Replace with the bootstrap service once implemented
  const isBootstrapped = true;
  return c.json(isBootstrapped);
});

app.get("/api/v1/auth/me", (c) => {
  // In a real application, replace this with actual user authentication check
  return c.json(null);
});

// Add a catch-all to see what's being requested
app.all("*", (c) => {
  console.log("Unhandled request:", c.req.url);
  return c.text("Not Found", 404);
});

Deno.serve({ port: 8000 }, app.fetch);
