import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_forms/onboarding/")({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    if (context.auth.hasOnboarded) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});

function RouteComponent() {
  return <div>Hello "/_authenticated/_forms/onboarding"!</div>;
}
