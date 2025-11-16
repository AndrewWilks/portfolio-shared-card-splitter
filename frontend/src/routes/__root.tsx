import {
  Outlet,
  createRootRouteWithContext,
  redirect,
} from "@tanstack/react-router";

import Providers from "../context/index.tsx";
import type { RouterContext } from "../router.tsx";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  beforeLoad: ({ context, location }) => {
    // Check if bootstrap is needed
    const isBootstrapped = context.auth.isBootstrapped;
    // If not bootstrapped and not on bootstrap page, redirect
    if (isBootstrapped === false && location.pathname !== "/auth/bootstrap") {
      throw redirect({
        to: "/auth/bootstrap",
      });
    }
  },
});

function RootComponent() {
  return (
    <Providers>
      <Outlet />
    </Providers>
  );
}
