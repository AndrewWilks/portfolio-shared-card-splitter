import { User, TUserLogin } from "@shared/entities/user/index.ts";
import { ApiError } from "@shared/entities/api/apiError.ts";
import { router } from "../router.tsx";

export interface AuthSnapshot {
  user: User | null;
  isAuthenticated: boolean;
  initialAuthChecked: boolean;
}

type Listener = (snapshot: AuthSnapshot) => void;

export class AuthService {
  private snapshot: AuthSnapshot = {
    user: null,
    isAuthenticated: false,
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
      user,
      isAuthenticated: !!user,
      initialAuthChecked: this.checkedInitialAuth,
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

if (authService.state.initialAuthChecked === false) {
  await authService.checkInitialAuth();
}
