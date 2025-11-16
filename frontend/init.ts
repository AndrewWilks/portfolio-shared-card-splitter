import { authService } from "./src/auth/AuthService.ts";

// Start auth checks immediately when this script loads
export const authReady = Promise.all([
  authService.checkBootstrapped(),
  authService.checkInitialAuth(),
]);
