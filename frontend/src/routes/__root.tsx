import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import RootLayout from "../components/layout/index.tsx";
import Providers from "../context/index.tsx";
import useBootstrap from "../hooks/useBootstrap.tsx";
import type { RouterContext } from "../router.tsx";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  useBootstrap();
  return (
    <Providers>
      <RootLayout>
        <Outlet />
      </RootLayout>
    </Providers>
  );
}
