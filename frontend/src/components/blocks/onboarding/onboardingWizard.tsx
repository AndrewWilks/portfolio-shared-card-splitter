import { useState } from "react";
import {
  MultiStepRoot,
  MultiStepProgress,
  MultiStepContent,
  MultiStepNavigation,
} from "@/components/ui/form/multi-step/index.ts";
import { WelcomeStep } from "./welcomeStep.tsx";
import { AccountSetupStep } from "./accountSetupStep.tsx";
import { PreferencesStep } from "./preferencesStep.tsx";
import { CompleteStep } from "./completeStep.tsx";

export interface OnboardingData {
  firstName: string;
  lastName: string;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    currency: string;
  };
}

export interface OnboardingWizardProps {
  /** Callback when onboarding is completed */
  onComplete: (data: OnboardingData) => void;
  /** Initial data to pre-fill the form */
  initialData?: Partial<OnboardingData>;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Onboarding wizard component
 * Multi-step form for new user onboarding
 */
export function OnboardingWizard({
  onComplete,
  initialData,
  className,
}: OnboardingWizardProps) {
  const [data, setData] = useState<OnboardingData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    preferences: {
      notifications: initialData?.preferences?.notifications ?? true,
      darkMode: initialData?.preferences?.darkMode ?? false,
      currency: initialData?.preferences?.currency || "USD",
    },
  });

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleComplete = () => {
    onComplete(data);
  };

  const stepLabels = ["Welcome", "Account", "Preferences", "Complete"];

  return (
    <div className={className}>
      <MultiStepRoot
        totalSteps={4}
        onComplete={handleComplete}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Welcome to Fair Share</h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Let's get you set up in just a few steps
          </p>
        </div>

        {/* Progress Indicator */}
        <MultiStepProgress
          labels={stepLabels}
          className="mb-10"
        />

        {/* Step Content */}
        <MultiStepContent
          animation="fade"
          className="min-h-[500px] mb-8"
        >
          <WelcomeStep />
          <AccountSetupStep
            data={data}
            onUpdate={updateData}
          />
          <PreferencesStep
            data={data}
            onUpdate={updateData}
          />
          <CompleteStep data={data} />
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
