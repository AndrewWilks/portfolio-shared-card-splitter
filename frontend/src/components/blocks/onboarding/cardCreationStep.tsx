import { useEffect, useMemo, useState } from "react";
import { CreditCard } from "lucide-react";
import { Input } from "@/components/ui/form/input.tsx";
import { FormErrorBox } from "@/components/ui/form/formErrorBox.tsx";
import { useMultiStep } from "@/components/ui/form/multi-step/index.ts";
import { z } from "zod";
import { Card } from "@shared/entities/card.ts";
import { cn } from "@/lib/utils.ts";
import type { TUserOnboarding } from "@shared/entities/user/index.ts";

// TODO: Use more semantic html tags
// TODO: Code Split into multiple components, constants, etc and follow solid principles

export interface CardCreationStepProps {
  data: TUserOnboarding;
  onUpdate: (updates: Partial<TUserOnboarding>) => void;
}

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
] as const;

const cardTypes = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "amex", label: "American Express" },
] as const;

export function CardCreationStep({ data, onUpdate }: CardCreationStepProps) {
  const { registerStepValidation, unregisterStepValidation } = useMultiStep();

  const [touched, setTouched] = useState<{
    name?: boolean;
    type?: boolean;
    last4?: boolean;
  }>({});

  // Validation schema
  const cardSchema = z.object({
    name: Card.nameSchema,
    type: Card.typeSchema,
    last4: Card.last4Schema,
  });

  const errors = useMemo(() => {
    if (!data.card) return {};

    const result = cardSchema.safeParse(data.card);

    if (result.success) {
      return {};
    }

    return {
      name: result.error?.issues.find((i) => i.path[0] === "name")?.message,
      type: result.error?.issues.find((i) => i.path[0] === "type")?.message,
      last4: result.error?.issues.find((i) => i.path[0] === "last4")?.message,
    };
  }, [data.card]);

  const isValid = useMemo(() => {
    return data.card && !errors.name && !errors.type && !errors.last4;
  }, [data.card, errors]);

  // Register validation for this step
  useEffect(() => {
    // Step index 2 (Card Creation is the third step)
    registerStepValidation(
      2,
      () => !!isValid,
      () => {
        setTouched({ name: true, type: true, last4: true });
      },
    );
    return () => unregisterStepValidation(2);
  }, [isValid, registerStepValidation, unregisterStepValidation]);

  const updateCard = <K extends keyof NonNullable<TUserOnboarding["card"]>>(
    key: K,
    value: NonNullable<TUserOnboarding["card"]>[K],
  ) => {
    onUpdate({
      card: {
        ...data.card,
        [key]: value,
      } as TUserOnboarding["card"],
    });
  };

  const updateCurrency = (
    currency: TUserOnboarding["preferences"]["currency"],
  ) => {
    onUpdate({
      preferences: {
        ...data.preferences,
        currency,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 mb-2">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-linear-to-br from-primary/20 to-primary/5 text-primary mb-3">
          <CreditCard className="size-8" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">
          Add Your First Card
        </h2>
        <p className="text-muted-foreground text-base md:text-lg">
          Track expenses for this payment method
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6 max-w-md mx-auto">
        {/* Card Name */}
        <div>
          <label
            htmlFor="cardName"
            className="block text-sm font-semibold mb-2.5 text-foreground"
          >
            Card Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="cardName"
            type="text"
            placeholder="e.g., Chase Sapphire"
            value={data.card?.name || ""}
            onChange={(e) => updateCard("name", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            aria-invalid={!!(touched.name && errors.name)}
            className="h-11 text-base"
          />
          {touched.name && errors.name && (
            <FormErrorBox
              message={errors.name}
            />
          )}
        </div>

        {/* Card Type */}
        <div>
          <label
            htmlFor="cardType"
            className="block text-sm font-semibold mb-2.5 text-foreground"
          >
            Card Type <span className="text-destructive">*</span>
          </label>
          <select
            id="cardType"
            value={data.card?.type || ""}
            onChange={(e) =>
              updateCard(
                "type",
                e.target.value as "visa" | "mastercard" | "amex",
              )}
            onBlur={() => setTouched((t) => ({ ...t, type: true }))}
            aria-invalid={!!(touched.type && errors.type)}
            className={cn(
              "h-11 w-full rounded-lg border-2 border-input bg-background px-4 text-base",
              "hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
              "transition-colors",
              touched.type && errors.type && "border-destructive",
            )}
          >
            <option value="">Select card type</option>
            {cardTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {touched.type && errors.type && (
            <FormErrorBox
              message={errors.type}
            />
          )}
        </div>

        {/* Last 4 Digits */}
        <div>
          <label
            htmlFor="last4"
            className="block text-sm font-semibold mb-2.5 text-foreground"
          >
            Last 4 Digits <span className="text-destructive">*</span>
          </label>
          <Input
            id="last4"
            type="text"
            placeholder="1234"
            maxLength={4}
            value={data.card?.last4 || ""}
            onChange={(e) => updateCard("last4", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, last4: true }))}
            aria-invalid={!!(touched.last4 && errors.last4)}
            className="h-11 text-base"
          />
          {touched.last4 && errors.last4 && (
            <FormErrorBox message={errors.last4} />
          )}
        </div>

        {/* Currency Selector */}
        <div>
          <label className="block text-sm font-semibold mb-3 text-foreground">
            Preferred Currency
          </label>
          <div className="grid grid-cols-2 gap-3">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                type="button"
                onClick={() => updateCurrency(currency.code)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-left",
                  data.preferences.currency === currency.code
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-input bg-card hover:border-primary/40",
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl">{currency.symbol}</span>
                  <span className="text-sm font-semibold text-foreground">
                    {currency.code}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {currency.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info Tip */}
      <div className="mt-8 p-5 rounded-xl bg-linear-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 max-w-md mx-auto border border-blue-200/50 dark:border-blue-800/50">
        <p className="text-sm text-foreground/80">
          💳 <strong className="text-foreground">Tip:</strong>{" "}
          This creates your first payment method. You can add more cards later
          and track expenses for each one separately.
        </p>
      </div>
    </div>
  );
}
