import { createFileRoute, redirect } from "@tanstack/react-router";
import { OnboardingWizard } from "@/components/blocks/onboarding/onboardingWizard.tsx";

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
  const handleComplete = (data: any) => {
    console.log("Onboarding completed with data:", data);
    alert(JSON.stringify(data, null, 2));
  };
  return <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-2">Multi-Step Form Demo</h1>
          <p className="text-muted-foreground">
            Testing the reusable multi-step form components
          </p>
        </div>
        <OnboardingWizard
          onComplete={handleComplete}
          className="max-w-4xl mx-auto p-6 rounded-lg border bg-card shadow-lg"
        />
      </div>;
}
