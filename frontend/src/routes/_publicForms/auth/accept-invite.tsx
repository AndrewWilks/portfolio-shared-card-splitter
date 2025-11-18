import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_publicForms/auth/accept-invite")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/auth/accept-invite"!</div>;
}
