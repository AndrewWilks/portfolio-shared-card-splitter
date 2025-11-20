import { useEffect } from "react";
import { Bell, DollarSign, Moon, Settings } from "lucide-react";
import { useMultiStep } from "@/components/ui/form/multi-step/index.ts";
import { cn } from "@/lib/utils.ts";
import type { OnboardingData } from "./onboardingWizard.tsx";

export interface PreferencesStepProps {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
}

// TODO: Use more semantic html tags
// TODO: Code Split into multiple components and follow solid principles

/**
 * Preferences step with mixed form controls and informational content
 * All fields are optional, so validation always passes
 */
export function PreferencesStep({ data, onUpdate }: PreferencesStepProps) {
  const { registerStepValidation, unregisterStepValidation } = useMultiStep();

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  ];

  // Register validation (always valid since preferences are optional)
  useEffect(() => {
    registerStepValidation(2, () => true);
    return () => unregisterStepValidation(2);
  }, [registerStepValidation, unregisterStepValidation]);

  const updatePreference = <K extends keyof OnboardingData["preferences"]>(
    key: K,
    value: OnboardingData["preferences"][K],
  ) => {
    onUpdate({
      preferences: {
        ...data.preferences,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 mb-2">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary mb-3">
          <Settings className="size-8" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">
          Customize Your Experience
        </h2>
        <p className="text-muted-foreground text-base md:text-lg">
          These settings can be changed later
        </p>
      </div>

      {/* Preferences */}
      <div className="space-y-5 max-w-md mx-auto">
        {/* Notifications */}
        <div className="flex items-center justify-between p-5 rounded-xl border-2 bg-card hover:border-primary/20 transition-all">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center size-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-primary shrink-0">
              <Bell className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Email Notifications</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Get updates about shared expenses
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={data.preferences.notifications}
            onClick={() =>
              updatePreference(
                "notifications",
                !data.preferences.notifications,
              )}
            className={cn(
              "relative inline-flex h-7 w-12 items-center rounded-full transition-colors shrink-0",
              data.preferences.notifications ? "bg-primary" : "bg-muted",
            )}
          >
            <span
              className={cn(
                "inline-block size-5 transform rounded-full bg-white shadow-sm transition-transform",
                data.preferences.notifications
                  ? "translate-x-6"
                  : "translate-x-1",
              )}
            />
          </button>
        </div>

        {/* Dark Mode */}
        <div className="flex items-center justify-between p-5 rounded-xl border-2 bg-card hover:border-primary/20 transition-all">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center size-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-primary shrink-0">
              <Moon className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Dark Mode</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Use dark theme for the interface
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={data.preferences.darkMode}
            onClick={() =>
              updatePreference("darkMode", !data.preferences.darkMode)}
            className={cn(
              "relative inline-flex h-7 w-12 items-center rounded-full transition-colors shrink-0",
              data.preferences.darkMode ? "bg-primary" : "bg-muted",
            )}
          >
            <span
              className={cn(
                "inline-block size-5 transform rounded-full bg-white shadow-sm transition-transform",
                data.preferences.darkMode ? "translate-x-6" : "translate-x-1",
              )}
            />
          </button>
        </div>

        {/* Currency */}
        <div className="p-5 rounded-xl border-2 bg-card hover:border-primary/20 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="inline-flex items-center justify-center size-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-primary shrink-0">
              <DollarSign className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Preferred Currency</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Default currency for transactions
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                type="button"
                onClick={() => updatePreference("currency", currency.code)}
                className={cn(
                  "p-4 rounded-lg border-2 text-left transition-all",
                  data.preferences.currency === currency.code
                    ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                    : "bg-background hover:bg-muted border-border hover:border-primary/30",
                )}
              >
                <div className="font-bold text-lg">
                  {currency.symbol} {currency.code}
                </div>
                <div className="text-xs opacity-80 mt-1">{currency.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 p-5 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 max-w-md mx-auto border">
        <p className="text-sm text-muted-foreground font-medium text-center">
          ℹ️ Don't worry - you can change all these settings from your profile
          at any time.
        </p>
      </div>
    </div>
  );
}
