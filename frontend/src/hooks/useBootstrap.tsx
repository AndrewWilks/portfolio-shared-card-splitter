// Hook to check the backend is bootstrapped and store the status in local storage, the backend delivers the is bootstrapped status via /api/v1/bootstrap/status endpoint as a true/false boolean in JSON format. If there it has not been bootstrapped, the user should be redirected to the bootstrap page using the TanStack router navigation method.

import { useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const BOOTSTRAP_KEY = "isBootstrapped";

interface UseBootstrapOptions {
  mock?: boolean;
}

export default function useBootstrap(options?: UseBootstrapOptions) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isBootstrapped, setIsBootstrapped] = useState<boolean | null>(() => {
    // Initialize from local storage
    const cached = localStorage.getItem(BOOTSTRAP_KEY);
    return cached ? JSON.parse(cached) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBootstrap = async () => {
      try {
        let bootstrapped: boolean;

        if (options?.mock) {
          // Use mock value for testing
          bootstrapped = options.mock ?? false;
        } else {
          // Fetch from /api/v1/bootstrap/status
          const response = await fetch("/api/v1/bootstrap/status");
          if (response.ok) {
            const data = await response.json();
            bootstrapped = data;
          } else {
            // API failed, keep cached value
            setIsLoading(false);
            return;
          }
        }

        // Update state and local storage with API response
        setIsBootstrapped(bootstrapped);
        localStorage.setItem(BOOTSTRAP_KEY, JSON.stringify(bootstrapped));

        // Redirect if not bootstrapped
        if (bootstrapped === false) {
          navigate({ to: "/auth/bootstrap" });
        } else if (location.pathname === "/auth/bootstrap") {
          navigate({ to: "/" });
        }
      } catch (error) {
        console.error("Error checking bootstrap status:", error);
        // Keep cached value on error
      } finally {
        setIsLoading(false);
      }
    };

    checkBootstrap();
  }, [navigate, options?.mock]);

  return { isBootstrapped, isLoading };
}
