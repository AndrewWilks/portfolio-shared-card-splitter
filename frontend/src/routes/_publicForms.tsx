import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_publicForms")({
  component: PublicFormsLayout,
});

function PublicFormsLayout() {
  return (
    <main className="min-h-screen p-4 container mx-auto pt-20">
      <Outlet />
    </main>
  );
}
