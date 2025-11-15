import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";

// helpers
import { STATUS_CODE } from "@std/http/status";

// Entities and Types
import { User } from "@shared/entities/user/index.ts";
import { ApiError, type TApiError } from "@shared/entities/api/apiError.ts";
import { ApiResponse } from "@shared/entities/api/apiResponse.ts";

// Services
import { TokenService } from "./services/tokenService.ts";
import { TokenCookieService } from "./services/tokenCookieService.ts";
import { BootstrapService } from "./services/bootstrapService.ts";
import { UserService } from "./services/userService.ts";

// Middleware
import { requireAuth } from "./middleware/auth.ts";

// Config
import { config } from "./.config/evnLoader.ts";
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
    origin: config().CORS_ORIGIN,
    credentials: true,
  })
);

app.use("*", logger());

app.get("/api", (c) => c.text("Hello Deno!"));

// Public routes (no authentication required)
app.get("/api/v1/bootstrap/status", async (c) => {
  const isBootstrapped = await BootstrapService.isBootstrapped();
  return c.json(isBootstrapped);
});

app.post(
  "/api/v1/bootstrap",
  zValidator("json", User.bootstrapSchema, (result, c) => {
    if (!result.success) {
      const errorData: TApiError = {
        message: "Invalid bootstrap data",
        code: ApiError.InternalCodes.INVALID_BOOTSTRAP_DATA,
      };
      return c.json(new ApiError(errorData), STATUS_CODE.BadRequest);
    }
  }),
  async (c) => {
    const { email, password, firstName, lastName } = c.req.valid("json");

    // Create the first user
    const response = await BootstrapService.bootstrapFirstUser(
      email,
      password,
      firstName,
      lastName
    );

    if (response instanceof ApiError) {
      return c.json(response, STATUS_CODE.BadRequest);
    }

    if (!response.data) {
      const errorData: TApiError = {
        message: "Bootstrap failed: No user data returned",
        code: ApiError.InternalCodes.INVALID_BOOTSTRAP_DATA,
      };
      return c.json(new ApiError(errorData), STATUS_CODE.BadRequest);
    }

    // Create token and set cookie (auto-login after bootstrap)
    const token = await TokenService.createToken(response.data.id);
    TokenCookieService.setTokenCookie(c, token);

    return c.json(response, STATUS_CODE.Created);
  }
);

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
    // TODO: Validate user credentials against database
    // For now, create token with dummy user ID
    const token = await TokenService.createToken(user.id);
    TokenCookieService.setTokenCookie(c, token);

    const apiResponse = new ApiResponse({
      data: user,
      message: "Login successful",
    });

    return c.json(apiResponse, STATUS_CODE.OK);
  }
);

// Apply authentication middleware to all /api/v1/* routes except public ones
app.use("/api/v1/*", requireAuth());

// Protected routes (authentication required)

app.post("/api/v1/auth/logout", (c) => {
  TokenCookieService.clearTokenCookie(c);

  const apiResponse = new ApiResponse({
    message: "Logout successful",
  });

  return c.json(apiResponse, STATUS_CODE.OK);
});

app.get("/api/v1/auth/me", async (c) => {
  // User is already authenticated and attached to context by middleware
  const tokenPayload = c.get("user");

  // Get user from database using the service
  const user = await UserService.getUserById(tokenPayload.userId);

  if (user instanceof ApiError) {
    return c.json(user, STATUS_CODE.NotFound);
  }

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
