import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/dashboard/card-accounts/$id/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/card-accounts/$id/"!</div>;
}
