import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/primitives/Button.tsx";
import { useMultiStep } from "./multiStepContext.tsx";

export interface MultiStepNavigationProps {
  /** Label for the previous button */
  previousLabel?: string;
  /** Label for the next button */
  nextLabel?: string;
  /** Label for the submit button (shown on last step) */
  submitLabel?: string;
  /** Additional CSS classes */
  className?: string;
  /** Hide previous button */
  hidePrevious?: boolean;
  /** Custom submit handler (called on last step) */
  onSubmit?: () => void;
  /** Show icons on buttons */
  showIcons?: boolean;
}

// TODO: Use more semantic html tags
// TODO: Code Split into multiple components and follow solid principles

/**
 * Navigation controls for multi-step forms
 * Provides Previous, Next, and Submit buttons with appropriate states
 */
export function MultiStepNavigation({
  previousLabel = "Previous",
  nextLabel = "Next",
  submitLabel = "Complete",
  className,
  hidePrevious = false,
  onSubmit,
  showIcons = true,
}: MultiStepNavigationProps) {
  const {
    currentStep,
    totalSteps,
    goNext,
    goPrevious,
    canGoNext,
    canGoPrevious,
  } = useMultiStep();

  const isLastStep = currentStep === totalSteps - 1;

  const handleNext = () => {
    if (isLastStep && onSubmit) {
      onSubmit();
    } else {
      goNext();
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 mt-6",
        className
      )}
    >
      {/* Previous Button */}
      {!hidePrevious && (
        <Button
          type="button"
          variant="outline"
          onClick={goPrevious}
          disabled={!canGoPrevious}
          className={cn(!canGoPrevious && "invisible")}
        >
          {showIcons && <ChevronLeft className="size-4" />}
          {previousLabel}
        </Button>
      )}

      {/* Spacer when previous is hidden */}
      {hidePrevious && <div />}

      {/* Next / Submit Button */}
      <Button
        type="button"
        onClick={handleNext}
        disabled={!canGoNext}
        variant={isLastStep ? "default" : "default"}
        className="ml-auto"
      >
        {isLastStep ? (
          <>
            {showIcons && <Check className="size-4" />}
            {submitLabel}
          </>
        ) : (
          <>
            {nextLabel}
            {showIcons && <ChevronRight className="size-4" />}
          </>
        )}
      </Button>
    </div>
  );
}
