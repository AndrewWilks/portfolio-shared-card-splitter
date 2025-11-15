import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import RootLayout from "../components/layout/index.tsx";
import Providers from "../context/index.tsx";
import useBootstrap from "../hooks/useBootstrap.tsx";
import type { RouterContext } from "../router.tsx";
// import { redirect } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  // beforeLoad: ({ context }) => {
  //   if (
  //     context.auth.isBootstrapped === false ||
  //     context.auth.isBootstrapped === null
  //   ) {
  //     throw redirect({
  //       to: "/auth/bootstrap",
  //     });
  //   }
  // },
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
