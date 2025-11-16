import { createFileRoute, Outlet } from "@tanstack/react-router";
import StackedLayout from "../layouts/StackedLayout.tsx";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <StackedLayout>
      <Outlet />
    </StackedLayout>
  );
}
