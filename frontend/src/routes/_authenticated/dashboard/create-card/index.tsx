import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Input } from "@/components/ui/form/input.tsx";
import { Button } from "@/components/ui/primitives/button.tsx";
import { FormErrorBox } from "@/components/ui/form/formErrorBox.tsx";
import { cn } from "@/lib/utils.ts";
import { CardService } from "@/services/CardService.ts";
import { ApiError } from "@shared/entities/api/apiError.ts";
import { useCards } from "@/context/card.tsx";
import {
  Card,
  type TCardSchema,
  type TCardType,
} from "@shared/entities/card.ts";

export const Route = createFileRoute("/_authenticated/dashboard/create-card/")({
  component: CreateCardPage,
});

function CreateCardPage() {
  const navigate = useNavigate();
  const { refreshCards } = useCards();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardTypes = Card.cardTypeEnumValues.map((type) => ({
    value: type,
    label: Card.cardTypeLabelMap[type],
  }));

  const [formData, setFormData] = useState<Omit<TCardSchema, "id" | "ownerId">>(
    {
      name: "",
      type: "" as TCardType,
      last4: "",
    },
  );

  const [touched, setTouched] = useState({
    name: false,
    type: false,
    last4: false,
  });

  const validators = {
    name: Card.nameSchema,
    type: Card.typeSchema,
    last4: Card.last4Schema,
  };

  const validateField = (field: keyof typeof validators, value: string) => {
    const result = validators[field].safeParse(value);
    return result.success ? null : result.error.issues[0].message;
  };

  // Field-level validation
  const fieldErrors = {
    name: touched.name ? validateField("name", formData.name) : null,
    type: touched.type ? validateField("type", formData.type) : null,
    last4: touched.last4 ? validateField("last4", formData.last4) : null,
  };

  const isValid = Object.values(fieldErrors).every((error) => error === null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await CardService.createCard({
        name: formData.name,
        type: formData.type as "visa" | "mastercard" | "amex",
        last4: formData.last4,
      });

      if (result instanceof ApiError) {
        setError(result.message || "Failed to create card");
        setIsSubmitting(false);
        return;
      }

      // Refresh cards in context and navigate to new card
      await refreshCards();
      navigate({ to: `/dashboard/${result.id}` });
    } catch (_) {
      setError("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-linear-to-br from-primary/20 to-primary/5 text-primary mb-3">
            <CreditCard className="size-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Add a New Card</h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Track expenses for another payment method
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
          {/* Global Error */}
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

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
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })}
              onBlur={() => setTouched({ ...touched, name: true })}
              aria-invalid={!!fieldErrors.name}
              className="h-11 text-base"
            />
            {fieldErrors.name && <FormErrorBox message={fieldErrors.name} />}
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
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "visa" | "mastercard" | "amex",
                })}
              onBlur={() => setTouched({ ...touched, type: true })}
              aria-invalid={!!fieldErrors.type}
              className={cn(
                "h-11 w-full rounded-lg border-2 border-input bg-background px-4 text-base",
                "hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
                "transition-colors",
                fieldErrors.type && "border-destructive",
              )}
            >
              <option value="">Select card type</option>
              {cardTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {fieldErrors.type && <FormErrorBox message={fieldErrors.type} />}
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
              value={formData.last4}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setFormData({ ...formData, last4: value });
              }}
              onBlur={() => setTouched({ ...touched, last4: true })}
              aria-invalid={!!fieldErrors.last4}
              className="h-11 text-base"
            />
            {fieldErrors.last4 && <FormErrorBox message={fieldErrors.last4} />}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/dashboard" })}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="flex-1"
            >
              {isSubmitting ? "Creating..." : "Create Card"}
            </Button>
          </div>
        </form>

        {/* Info Tip */}
        <div className="mt-8 p-5 rounded-xl bg-linear-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 max-w-md mx-auto border border-blue-200/50 dark:border-blue-800/50">
          <p className="text-sm text-foreground/80">
            💳 <strong className="text-foreground">Tip:</strong>{" "}
            You can add multiple cards and track expenses for each one
            separately.
          </p>
        </div>
      </div>
    </div>
  );
}
