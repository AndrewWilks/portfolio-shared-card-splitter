import { useEffect, useMemo, useState } from "react";
import { Bell, Moon, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/form/input.tsx";
import { FormErrorBox } from "@/components/ui/form/formErrorBox.tsx";
import { useMultiStep } from "@/components/ui/form/multi-step/index.ts";
import { z } from "zod";
import { User } from "@shared/entities/user/index.ts";
import { cn } from "@/lib/utils.ts";
import { TApiRequest } from "@shared/entities/user/onboarding.ts";

export interface AccountSetupStepProps {
  data: TApiRequest;
  onUpdate: (updates: Partial<TApiRequest>) => void;
}

const { firstNameSchema, lastNameSchema } = User;

// TODO: Use more semantic html tags
// TODO: Code Split into multiple components and follow solid principles

/**
 * Account setup step with form fields and validation
 * Email is not collected as user is invited via email
 */
export function AccountSetupStep({ data, onUpdate }: AccountSetupStepProps) {
  const { registerStepValidation, unregisterStepValidation } = useMultiStep();

  // Track which fields have been touched (blurred)
  const [touched, setTouched] = useState<{
    firstName?: boolean;
    lastName?: boolean;
  }>({});

  // Validation schema - email not needed as user is invited
  const accountSchema = z.object({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
  });

  const errors = useMemo(() => {
    const result = accountSchema.safeParse({
      firstName: data.firstName,
      lastName: data.lastName,
    });

    if (result.success) {
      return {};
    }

    return {
      firstName: result.error?.issues.find((i) => i.path[0] === "firstName")
        ?.message,
      lastName: result.error?.issues.find((i) => i.path[0] === "lastName")
        ?.message,
    };
  }, [data.firstName, data.lastName]);

  // Validation check
  const isValid = useMemo(
    () => !errors.firstName && !errors.lastName,
    [errors],
  );

  // Register validation for this step
  useEffect(() => {
    // Step index 1 (Account Setup is the second step)
    registerStepValidation(
      1,
      () => isValid,
      () => {
        // Mark all fields as touched when validation fails on Next attempt
        setTouched({ firstName: true, lastName: true });
      },
    );
    return () => unregisterStepValidation(1);
  }, [isValid, registerStepValidation, unregisterStepValidation]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3 mb-2">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-linear-to-br from-primary/20 to-primary/5 text-primary mb-3">
          <UserIcon className="size-8" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">
          Complete Your Profile
        </h2>
        <p className="text-muted-foreground text-base md:text-lg">
          Tell us a bit about yourself
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6 max-w-md mx-auto">
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-semibold mb-2.5 text-foreground"
          >
            First Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="firstName"
            type="text"
            placeholder="Enter your first name"
            value={data.firstName}
            onChange={(e) => onUpdate({ firstName: e.target.value })}
            onBlur={() => setTouched((t) => ({ ...t, firstName: true }))}
            aria-invalid={!!(touched.firstName && errors.firstName)}
            className="h-11 text-base"
          />
          {touched.firstName && errors.firstName && (
            <FormErrorBox message={errors.firstName} />
          )}
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-semibold mb-2.5 text-foreground"
          >
            Last Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="lastName"
            type="text"
            placeholder="Enter your last name"
            value={data.lastName}
            onChange={(e) => onUpdate({ lastName: e.target.value })}
            onBlur={() => setTouched((t) => ({ ...t, lastName: true }))}
            aria-invalid={!!(touched.lastName && errors.lastName)}
            className="h-11 text-base"
          />
          {touched.lastName && errors.lastName && (
            <FormErrorBox message={errors.lastName} />
          )}
        </div>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between p-5 rounded-xl border-2 bg-card hover:border-primary/20 transition-all">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center size-12 rounded-lg bg-linear-to-br from-primary/20 to-primary/5 text-primary shrink-0">
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
              onUpdate({
                preferences: {
                  ...data.preferences,
                  notifications: !data.preferences.notifications,
                },
              })}
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

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between p-5 rounded-xl border-2 bg-card hover:border-primary/20 transition-all">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center size-12 rounded-lg bg-linear-to-br from-primary/20 to-primary/5 text-primary shrink-0">
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
              onUpdate({
                preferences: {
                  ...data.preferences,
                  darkMode: !data.preferences.darkMode,
                },
              })}
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
      </div>

      {/* Info Tip */}
      <div className="mt-8 p-5 rounded-xl bg-linear-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 max-w-md mx-auto border border-blue-200/50 dark:border-blue-800/50">
        <p className="text-sm text-foreground/80">
          💡 <strong className="text-foreground">Tip:</strong>{" "}
          Complete your profile to get started managing shared expenses.
        </p>
      </div>
    </div>
  );
}
