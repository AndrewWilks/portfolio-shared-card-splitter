import {
  User,
  TUserLogin,
  TUserBootstrap,
} from "@shared/entities/user/index.ts";
import { ApiError } from "@shared/entities/api/apiError.ts";
import { router } from "../router.tsx";

export interface AuthSnapshot {
  user: User | null;
  isAuthenticated: boolean;
  isBootstrapped: boolean | null;
  initialAuthChecked: boolean;
}

type Listener = (snapshot: AuthSnapshot) => void;

export class AuthService {
  private snapshot: AuthSnapshot = {
    user: null,
    isAuthenticated: false,
    isBootstrapped: null,
    initialAuthChecked: false,
  };

  private listeners = new Set<Listener>();

  get state(): AuthSnapshot {
    return this.snapshot;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    // Push current state immediately
    listener(this.snapshot);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.snapshot);
    }
  }

  private setUser(user: User | null) {
    this.snapshot = {
      ...this.snapshot,
      user,
      isAuthenticated: !!user,
    };
    this.notify();
  }

  async login(data: TUserLogin) {
    const res = await User.login(data);

    if (res instanceof ApiError) {
      return res;
    }

    if (!res.data) {
      return new ApiError({
        message: "Login failed: No user data returned",
        code: ApiError.InternalCodes.INVALID_LOGIN_DATA,
      });
    }

    this.setUser(res.data);
    return res;
  }

  async logout() {
    const res = await User.logout();

    if (res instanceof ApiError) {
      return res;
    }

    this.setUser(null);
    await router.navigate({
      to: "/auth/login",
      replace: true,
      search: () => ({ redirectTo: router.latestLocation.pathname }),
    });
    return res;
  }

  async bootstrap(data: TUserBootstrap) {
    const res = await User.bootstrap(data);

    if (res instanceof ApiError) {
      return res;
    }

    if (!res.data) {
      return new ApiError({
        message: "Bootstrap failed: No user data returned",
        code: ApiError.InternalCodes.INVALID_BOOTSTRAP_DATA,
      });
    }

    // Set user in state (backend already set auth cookie)
    this.setUser(res.data);

    // Update bootstrap status
    this.isBootstrapped = true;

    return res;
  }

  get isBootstrapped(): boolean | null {
    return this.snapshot.isBootstrapped;
  }

  private set isBootstrapped(value: boolean) {
    this.snapshot = {
      ...this.snapshot,
      isBootstrapped: value,
    };
    // Also cache in localStorage
    localStorage.setItem("isBootstrapped", value ? "true" : "false");
    this.notify();
  }

  /**
   * Check bootstrap status from API and update state
   * @returns Promise<boolean> - true if bootstrapped, false otherwise
   */
  async checkBootstrapped(): Promise<boolean> {
    try {
      const res = await fetch("/api/v1/bootstrap/status");

      if (!res.ok) {
        const data = await res.json();
        const error = ApiError.parse(data);
        console.error("Bootstrap check failed:", error.message);
        // Return cached value if API fails
        return this.getCachedBootstrapStatus() ?? false;
      }

      const data = await res.json();
      const bootstrapped = Boolean(data);

      // Update state
      this.isBootstrapped = bootstrapped;

      return bootstrapped;
    } catch (error) {
      console.error("Bootstrap check error:", error);
      // Return cached value if network fails
      return this.getCachedBootstrapStatus() ?? false;
    }
  }

  /**
   * Get cached bootstrap status from localStorage
   */
  private getCachedBootstrapStatus(): boolean | null {
    const stored = localStorage.getItem("isBootstrapped");
    if (stored === null) return null;
    return stored === "true";
  }

  /**
   * Initialize bootstrap state from cache
   */
  initializeFromCache() {
    const cached = this.getCachedBootstrapStatus();
    if (cached !== null) {
      this.snapshot = {
        ...this.snapshot,
        isBootstrapped: cached,
      };
    }
  }

  get checkedInitialAuth() {
    return sessionStorage.getItem("initialAuthChecked") === "true";
  }

  set checkedInitialAuth(value: boolean) {
    sessionStorage.setItem("initialAuthChecked", value ? "true" : "false");
  }

  async checkInitialAuth() {
    if (this.checkedInitialAuth) {
      return;
    }

    const res = await User.me();

    if (res instanceof ApiError) {
      this.checkedInitialAuth = true;
      this.notify();
      return;
    }

    if (!res.data) {
      this.checkedInitialAuth = true;
      this.notify();
      return;
    }

    this.checkedInitialAuth = true;
    this.setUser(res.data);
  }
}

// singleton for client side SPA
export const authService = new AuthService();

// Initialize from cache immediately (synchronous)
authService.initializeFromCache();

// Then check API in background (async)
authService.checkBootstrapped().then((bootstrapped) => {
  // Only check auth if bootstrapped
  if (bootstrapped && !authService.state.initialAuthChecked) {
    authService.checkInitialAuth();
  }
});
