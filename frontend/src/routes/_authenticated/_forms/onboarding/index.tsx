import { createFileRoute, redirect } from "@tanstack/react-router";
import { OnboardingWizard } from "@/components/blocks/onboarding/onboardingWizard.tsx";
import { useNavigate } from "@tanstack/react-router";
import { TApiResponse } from "@shared/entities/user/onboarding.ts";

export const Route = createFileRoute("/_authenticated/_forms/onboarding/")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.auth.hasOnboarded) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});

function RouteComponent() {
  const navigate = useNavigate();

  const handleComplete = async (res: TApiResponse) => {
    // Set cookie (don't await as cookieStore might be undefined)
    await globalThis.cookieStore?.set(
      "lastSelectedCardId",
      res.data!.card!.id!,
    );

    navigate({
      to: `/dashboard/${res.data!.card!.id!}`,
      reloadDocument: true,
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
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
    </div>
  );
}
