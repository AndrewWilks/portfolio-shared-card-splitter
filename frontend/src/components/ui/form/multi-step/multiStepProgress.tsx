import { cn } from "@/lib/utils.ts";
import { useMultiStep } from "./multiStepContext.tsx";
import {
  StepIndicator,
  StepStatus,
} from "@/components/ui/primitives/stepIndicator.tsx";
import { StepConnector } from "@/components/ui/primitives/stepConnector.tsx";
import { canNavigateToStep } from "./utils/canNavigateToStep.ts";
import { getStepStatus } from "./utils/getStepStatus.ts";

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

/**
 * Progress indicator for multi-step forms
 * Shows step numbers/labels with visual indication of current, completed, and future steps
 * Responsive: dots on mobile, full labels on desktop
 * Uses semantic HTML nav and ordered list elements
 */
export function MultiStepProgress({
  labels,
  className,
  showLabelsOnMobile = false,
  allowNavigation = true,
}: MultiStepProgressProps) {
  const {
    currentStep,
    totalSteps,
    completedSteps,
    visitedSteps,
    goToStep,
    isStepValid,
  } = useMultiStep();

  const steps = Array.from({ length: totalSteps }, (_, i) => i);

  return (
    <nav
      className={cn("w-full max-w-2xl mx-auto", className)}
      aria-label="Progress"
    >
      {/* Steps as ordered list */}
      <ol className="flex items-center justify-center w-full list-none p-0 m-0">
        {steps.map((step, index) => {
          const status: StepStatus = getStepStatus(
            step,
            currentStep,
            completedSteps,
            visitedSteps,
          );
          const label = labels?.[index] || `Step ${step + 1}`;
          const isCurrentValid = isStepValid(currentStep);

          // Can click if: allowNavigation is true AND user can navigate to this step
          const isClickable = allowNavigation && canNavigateToStep(
            step,
            currentStep,
            visitedSteps,
            isCurrentValid,
          );

          return (
            <li key={step} className="flex items-center">
              {/* Step indicator and label wrapper with fixed width for consistent spacing */}
              <div className="flex flex-col items-center min-w-16 md:min-w-20">
                {/* Step indicator button */}
                <StepIndicator
                  stepNumber={step + 1}
                  label={label}
                  status={status}
                  isClickable={isClickable}
                  onClick={() => goToStep(step)}
                />

                {/* Label */}
                <span
                  className={cn(
                    "mt-2 md:mt-3 text-xs md:text-sm font-medium text-center transition-colors px-1",
                    showLabelsOnMobile ? "block" : "hidden md:block",
                    status === "active" && "text-foreground font-semibold",
                    (status === "completed" || status === "visited") &&
                      "text-muted-foreground",
                    status === "future" && "text-muted-foreground/60",
                  )}
                >
                  {label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <StepConnector
                  isCompleted={completedSteps.has(step)}
                  orientation="horizontal"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
