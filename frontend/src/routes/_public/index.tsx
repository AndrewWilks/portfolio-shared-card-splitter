import { createFileRoute, Link } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({
  component: Index,
  beforeLoad: (c) => {
    const { isAuthenticated } = c.context.auth;
    if (isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function Index() {
  return (
    <div className="p-2">
      <h1>Welcome to FairShare!</h1>
      <p>Please log in or sign up to continue.</p>
      <Link to="/auth/login" search={() => ({ redirectTo: "/" })}>
        Log In
      </Link>
      &emsp;{"|"}&emsp;
      <Link to="/auth/accept-invite">Accept an Invite</Link>
    </div>
  );
}
