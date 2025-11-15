import { useCallback, useMemo, useState } from "react";
import classname from "classnames";
import { useAuth } from "../AuthContext.tsx";
import { ApiError } from "@shared/entities/api/apiError.ts";
import { LogOut, Ban } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

export default function LogoutBtn() {
  const { logout } = useAuth();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const handleLogout = useCallback(async () => {
    const result = await logout();

    if (result instanceof ApiError) {
      console.error("Logout failed:", result.message);
      setError(result.message || "Logout failed");
      return;
    }
  }, [logout, router]);

  const hasError = useMemo(() => Boolean(error), [error]);

  const title = useMemo(() => {
    if (hasError) return `Logout failed: ${error}`;
    return "Logout";
  }, [hasError, error]);

  return (
    <button
      onClick={async () => await handleLogout()}
      type="button"
      title={title}
      disabled={hasError}
      className={classname(
        // Base styles
        "p-2 rounded-md transition-colors duration-200 dark:text-gray-200 cursor-pointer",
        // Hover effect
        "hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-200",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Active
        "active:bg-gray-300 dark:active:bg-gray-600",
        hasError &&
          "bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
      )}
    >
      {hasError ? <Ban size={12} /> : <LogOut size={12} />}
    </button>
  );
}
