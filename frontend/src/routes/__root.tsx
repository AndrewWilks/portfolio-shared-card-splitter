import {
  Outlet,
  createRootRouteWithContext,
  redirect,
} from "@tanstack/react-router";

import RootLayout from "../components/layout/index.tsx";
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

    // If bootstrapped and on bootstrap page, redirect to home
    if (isBootstrapped === true && location.pathname === "/auth/bootstrap") {
      throw redirect({
        to: "/",
      });
    }
  },
});

function RootComponent() {
  return (
    <Providers>
      <RootLayout>
        <Outlet />
      </RootLayout>
    </Providers>
  );
}
