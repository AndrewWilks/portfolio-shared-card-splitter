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

// Add a catch-all to see what's being requested
app.all("*", (c) => {
  console.log("Unhandled request:", c.req.url);
  return c.text("Not Found", 404);
});

Deno.serve({ port: 8000 }, app.fetch);
