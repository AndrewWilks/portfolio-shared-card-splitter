import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";
import { AuthContextValue, useAuth } from "./auth/AuthContext.tsx";

export type RouterContext = {
  auth: AuthContextValue;
};

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!, // We'll inject this when we render
  },
  defaultPendingComponent: () => (
    <div className={`p-2 text-2xl`}>
      {/* TODO: Add spinner component */}
      Loading ...
    </div>
  ),
  defaultErrorComponent: ({ error }) => (
    <div className={`p-2 max-w-xl`}>
      <p className={`text-2xl`}>
        {/* TODO: Add error component */}
        Error
      </p>
      <pre className={`p-2 whitespace-pre-wrap`}>{String(error)}</pre>
    </div>
  ),
  defaultPreload: "intent",
  scrollRestoration: true,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function Router() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}
