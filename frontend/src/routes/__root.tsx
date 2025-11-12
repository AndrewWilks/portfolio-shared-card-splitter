import { Outlet, createRootRoute } from "@tanstack/react-router";
import RootLayout from "../components/layout/index.tsx";
import Providers from "../context/index.tsx";

export const Route = createRootRoute({
  component: RootComponent,
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
