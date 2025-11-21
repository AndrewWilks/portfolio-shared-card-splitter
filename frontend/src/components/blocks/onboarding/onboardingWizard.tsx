import { useEffect, useState } from "react";
import {
  MultiStepContent,
  MultiStepNavigation,
  MultiStepProgress,
  MultiStepRoot,
} from "@/components/ui/form/multi-step/index.ts";
import { WelcomeStep } from "./welcomeStep.tsx";
import { AccountSetupStep } from "./accountSetupStep.tsx";
import { CardCreationStep } from "./cardCreationStep.tsx";
import { CompleteStep } from "./completeStep.tsx";
import { type TUserOnboarding, User } from "@shared/entities/user/index.ts";

export interface OnboardingWizardProps {
  /** Callback when onboarding is completed */
  onComplete: (data: TUserOnboarding) => void;
  /** Initial data to pre-fill the form */
  initialData?: Partial<TUserOnboarding>;
  /** Additional CSS classes */
  className?: string;
}

// TODO: Use more semantic html tags

/**
 * Onboarding wizard component
 * Multi-step form for new user onboarding with dynamic card creation step
 */
export function OnboardingWizard({
  onComplete,
  initialData,
  className,
}: OnboardingWizardProps) {
  const [hasExistingCards, setHasExistingCards] = useState<boolean | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<TUserOnboarding>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    preferences: {
      notifications: initialData?.preferences?.notifications ?? true,
      darkMode: initialData?.preferences?.darkMode ?? false,
      currency: initialData?.preferences?.currency || "USD",
    },
    card: initialData?.card,
  });

  // Fetch cards on mount to determine if user needs card creation step
  useEffect(() => {
    async function checkCards() {
      try {
        const res = await fetch("/api/v1/cards", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setHasExistingCards(false);
          setLoading(false);
          return;
        }

        const responseData = await res.json();
        const cards = responseData.data || [];
        setHasExistingCards(Array.isArray(cards) && cards.length > 0);
      } catch (error) {
        console.error("Failed to fetch cards:", error);
        setHasExistingCards(false);
      } finally {
        setLoading(false);
      }
    }
    checkCards();
  }, []);

  const updateData = (updates: Partial<TUserOnboarding>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleComplete = async () => {
    // Validate with User.onboardingSchema
    const parseResult = User.onboardingSchema.safeParse(data);
    if (!parseResult.success) {
      console.error("Validation failed:", parseResult.error);
      return;
    }

    // Call onboarding API
    try {
      const res = await fetch("/api/v1/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(parseResult.data),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Onboarding failed:", error);
        return;
      }

      const responseData = await res.json();
      console.log("Onboarding successful:", responseData);

      // Call the onComplete callback with the data
      onComplete(parseResult.data);
    } catch (error) {
      console.error("Onboarding API error:", error);
    }
  };

  // Dynamic totalSteps and labels based on hasExistingCards
  const totalSteps = hasExistingCards ? 3 : 4;
  const stepLabels = hasExistingCards
    ? ["Welcome", "Account", "Complete"]
    : ["Welcome", "Account", "Create Card", "Complete"];

  // Show loading state while fetching cards
  if (loading) {
    return (
      <div className={className}>
        <div className="max-w-3xl mx-auto text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary">
          </div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <MultiStepRoot
        totalSteps={totalSteps}
        onComplete={handleComplete}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Welcome to Fair Share
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Let's get you set up in just a few steps
          </p>
        </div>

        {/* Progress Indicator */}
        <MultiStepProgress labels={stepLabels} className="mb-10" />

        {/* Step Content */}
        <MultiStepContent animation="fade" className="min-h-[500px] mb-8">
          <WelcomeStep />
          <AccountSetupStep data={data} onUpdate={updateData} />
          {!hasExistingCards && (
            <CardCreationStep data={data} onUpdate={updateData} />
          )}
          <CompleteStep data={data} hasCard={!hasExistingCards} />
        </MultiStepContent>

        {/* Navigation */}
        <MultiStepNavigation
          submitLabel="Get Started"
          onSubmit={handleComplete}
        />
      </MultiStepRoot>
    </div>
  );
}
