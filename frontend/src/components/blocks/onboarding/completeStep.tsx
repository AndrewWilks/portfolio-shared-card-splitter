import { Bell, CheckCircle2, DollarSign, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import type { OnboardingData } from "./onboardingWizard.tsx";

export interface CompleteStepProps {
  data: OnboardingData;
}

// TODO: Use more semantic html tags
// TODO: Code Split into multiple components and follow solid principles

/**
 * Completion step showing a summary of user choices
 * Final step before submission
 */
export function CompleteStep({ data }: CompleteStepProps) {
  const summaryItems = [
    { label: "First Name", value: data.firstName, icon: User },
    { label: "Last Name", value: data.lastName, icon: User },
    {
      label: "Notifications",
      value: data.preferences.notifications ? "Enabled" : "Disabled",
      icon: Bell,
    },
    {
      label: "Theme",
      value: data.preferences.darkMode ? "Dark Mode" : "Light Mode",
      icon: Settings,
    },
    {
      label: "Currency",
      value: data.preferences.currency,
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center space-y-5">
        <div className="inline-flex items-center justify-center size-20 rounded-full bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 text-green-600 dark:text-green-400 mb-4 shadow-lg">
          <CheckCircle2 className="size-10" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">You're All Set!</h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Review your information below and click "Get Started" to begin
          managing your shared cards.
        </p>
      </div>

      {/* Summary */}
      <div className="space-y-4 max-w-lg mx-auto">
        {summaryItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={cn(
                "p-5 rounded-xl border-2 bg-card flex items-start gap-4",
                "hover:border-primary/20 transition-all",
              )}
            >
              <div className="inline-flex items-center justify-center size-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-primary shrink-0">
                <Icon className="size-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-muted-foreground mb-1.5">
                  {item.label}
                </div>
                <div className="font-bold text-base truncate">{item.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Steps */}
      <div className="mt-10 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 max-w-lg mx-auto border-2 border-primary/20 shadow-lg">
        <h3 className="font-bold text-xl mb-5 text-center">What's Next?</h3>
        <ul className="space-y-3 text-sm md:text-base">
          <li className="flex items-start gap-3">
            <span className="text-primary shrink-0 text-lg font-bold">✓</span>
            <span className="text-foreground">
              Set up your first shared credit card
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary shrink-0 text-lg font-bold">✓</span>
            <span className="text-foreground">
              Invite your card partners to join
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary shrink-0 text-lg font-bold">✓</span>
            <span className="text-foreground">
              Start tracking and allocating expenses
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
