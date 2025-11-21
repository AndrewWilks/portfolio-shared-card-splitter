import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_publicForms/rnd")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_publicForms/rnd"!</div>;
}
