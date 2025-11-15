import { useCallback, useMemo, useState } from "react";
import classname from "classnames";
import { useAuth } from "../AuthContext.tsx";
import { ApiError } from "@shared/entities/api/apiError.ts";
import { LogOut, Ban } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";

export default function LogoutBtn() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState<string | null>(null);

  const handleLogout = useCallback(async () => {
    const result = await logout();

    if (result instanceof ApiError) {
      console.error("Logout failed:", result.message);
      setError(result.message || "Logout failed");
      return;
    }

    return navigate({
      to: "/auth/login",
      replace: true,
      search: () => ({ redirectTo: location.pathname }),
    });
  }, [logout, navigate, location.pathname]);

  const hasError = useMemo(() => Boolean(error), [error]);

  const title = useMemo(() => {
    if (hasError) return `Logout failed: ${error}`;
    return "Logout";
  }, [hasError, error]);

  return (
    // TODO: Style this button
    <button
      onClick={handleLogout}
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
        hasError && "bg-red-100 hover:bg-red-200"
      )}
    >
      {hasError ? <Ban size={12} /> : <LogOut size={12} />}
    </button>
  );
}
