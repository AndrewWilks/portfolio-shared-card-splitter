import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";

// helpers
import {
  generateSignedCookie,
  getSignedCookie,
  deleteCookie,
} from "hono/cookie";
import { STATUS_CODE } from "@std/http/status";

// Entities and Types
import { User } from "@shared/entities/user/index.ts";
import { ApiError, type TApiError } from "@shared/entities/api/apiError.ts";
import { ApiResponse } from "@shared/entities/api/apiResponse.ts";

const secret = "your-secret-key"; // TODO: Use a secure secret from env variables
const user = new User({
  id: crypto.randomUUID(),
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
});

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

// TODO: Protect routes that require authentication

app.get("/api/v1/bootstrap/status", (c) => {
  // In a real application, replace this with actual bootstrap status check
  // TODO: Implement in the bootstrap service
  const isBootstrapped = true;
  return c.json(isBootstrapped);
});

// TODO: refactor to AuthService, needs to validate user credentials and create session
app.post(
  "/api/v1/auth/login",
  zValidator("json", User.loginSchema, (result, c) => {
    if (!result.success) {
      const errorData: TApiError = {
        message: "Invalid login data",
        code: ApiError.InternalCodes.INVALID_LOGIN_DATA,
      };
      return c.json(new ApiError(errorData), 400);
    }
  }),
  async (c) => {
    const cookie = await generateSignedCookie(
      "session",
      "dummy-session-token", // TODO: Replace with real session token
      secret,
      {
        path: "/",
        secure: Deno.env.get("ENV") === "production",
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 day
        expires: new Date(Date.now() + 60 * 60 * 24 * 1000), // 1 day
      }
    );

    return c.json(
      new ApiResponse({
        data: user, // TODO: Return user data as well from the Database to replace dummy data
        message: "Login successful",
      }),
      STATUS_CODE.OK,
      {
        "Set-Cookie": cookie,
      }
    );
  }
);

// TODO: refactor to AuthService, needs to invalidate session server-side
app.post("/api/v1/auth/logout", async (c) => {
  const isSecure = Deno.env.get("ENV") === "production" ? "secure" : undefined;

  const cookie = await getSignedCookie(c, secret, "session", isSecure);
  const parseResult = User.logoutSchema.safeParse(cookie);
  if (!parseResult.success) {
    const errorData: TApiError = {
      message: "Invalid logout data",
      code: ApiError.InternalCodes.INVALID_LOGOUT_DATA,
      details: JSON.stringify(parseResult.error.issues),
    };
    return c.json(new ApiError(errorData), STATUS_CODE.BadRequest);
  }

  const deleteCookieHeader = deleteCookie(c, "session", {
    path: "/",
    secure: Deno.env.get("ENV") === "production",
    httpOnly: true,
    expires: new Date(0),
  });

  if (!deleteCookieHeader) {
    const errorData: TApiError = {
      message: "Failed to delete session cookie",
      code: ApiError.InternalCodes.UNKNOWN_ERROR,
    };
    return c.json(new ApiError(errorData), 500);
  }

  return c.json({ message: "Logged out successfully" }, STATUS_CODE.OK, {
    "Set-Cookie": deleteCookieHeader,
  });
});

// TODO: refactor to AuthService
app.get("/api/v1/auth/me", (c) => {
  // TODO: Return user data as well from the Database to replace dummy data
  return c.json(
    new ApiResponse({
      data: user,
      message: "User data retrieved successfully",
    }),
    STATUS_CODE.OK
  );
});

// Add a catch-all to see what's being requested
app.all("*", (c) => {
  console.log("Unhandled request:", c.req.url);
  return c.text("Not Found", 404);
});

Deno.serve({ port: 8000 }, app.fetch);
