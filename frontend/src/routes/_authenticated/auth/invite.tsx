import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/auth/invite")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/auth/invite"!</div>;
}
