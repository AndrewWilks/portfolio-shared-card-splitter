import { Check } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { useMultiStep } from "./multiStepContext.tsx";

export interface MultiStepProgressProps {
  /** Optional step labels (if not provided, will show step numbers) */
  labels?: string[];
  /** Additional CSS classes */
  className?: string;
  /** Show labels on mobile (default: false, shows dots only) */
  showLabelsOnMobile?: boolean;
  /** Allow navigation to completed or current steps by clicking */
  allowNavigation?: boolean;
}

// TODO: Use more semantic html tags
// TODO: Code Split into multiple components making it more reusabled if applicable and follow solid principles

/**
 * Progress indicator for multi-step forms
 * Shows step numbers/labels with visual indication of current, completed, and future steps
 * Responsive: dots on mobile, full labels on desktop
 */
export function MultiStepProgress({
  labels,
  className,
  showLabelsOnMobile = false,
  allowNavigation = true,
}: MultiStepProgressProps) {
  const { currentStep, totalSteps, completedSteps, visitedSteps, goToStep, isStepValid } = useMultiStep();

  const steps = Array.from({ length: totalSteps }, (_, i) => i);

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      {/* Steps */}
      <div className="flex items-center justify-center w-full">
        {steps.map((step, index) => {
          const isActive = step === currentStep;
          const isCompleted = completedSteps.has(step);
          const isVisited = visitedSteps.has(step);
          const isNextStep = step === currentStep + 1;
          const isCurrentValid = isStepValid(currentStep);
          const isFuture = step > currentStep && !isVisited;
          const label = labels?.[index] || `Step ${step + 1}`;
          
          // Can click if: visited, or is next step and current is valid
          const isClickable = allowNavigation && (
            isVisited || 
            (isNextStep && isCurrentValid)
          );

          return (
            <>
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => isClickable && goToStep(step)}
                  disabled={!isClickable}
                  className={cn(
                    "flex items-center justify-center rounded-full transition-all duration-200",
                    "size-8 md:size-12",
                    "font-bold text-base md:text-lg",
                    "shadow-sm",
                    isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110",
                    isCompleted && !isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
                    isVisited && !isCompleted && !isActive && "bg-primary/80 text-primary-foreground hover:bg-primary",
                    isFuture && !isClickable && "bg-muted text-muted-foreground border-2 border-border opacity-50",
                    isFuture && isClickable && "bg-muted text-muted-foreground border-2 border-primary/30 hover:border-primary/50 hover:bg-muted/80",
                    isClickable && "cursor-pointer hover:scale-105",
                    !isClickable && "cursor-default"
                  )}
                  aria-label={label}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isCompleted && !isActive ? (
                    <Check className="size-5 md:size-6" />
                  ) : (
                    <span>{step + 1}</span>
                  )}
                </button>

                {/* Label */}
                <span
                  className={cn(
                    "mt-3 text-xs md:text-sm font-medium text-center transition-colors max-w-20",
                    showLabelsOnMobile ? "block" : "hidden md:block",
                    isActive && "text-foreground font-semibold",
                    (isCompleted || isVisited) && !isActive && "text-muted-foreground",
                    isFuture && "text-muted-foreground/60"
                  )}
                >
                  {label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-1 flex-1 min-w-4 max-w-16 mx-4 md:mx-6 md:mb-6 transition-all duration-300 rounded-full",
                    completedSteps.has(step) ? "bg-primary shadow-sm" : "bg-border"
                  )}
                  aria-hidden="true"
                />
              )}
            </>
          );
        })}
      </div>
    </div>
  );
}
