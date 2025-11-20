import { useCallback, useMemo, useState } from "react";
import { useAuth } from "../AuthContext.tsx";
import { ApiError } from "@shared/entities/api/apiError.ts";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/primitives/Button.tsx";
import { Ban, LogOut } from "lucide-react";

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
    <Button
      onClick={async () => await handleLogout()}
      type="button"
      title={title}
      disabled={hasError}
      variant={hasError ? "destructive" : "ghost"}
      size="icon"
    >
      {hasError ? <Ban /> : <LogOut />}
    </Button>
  );
}
