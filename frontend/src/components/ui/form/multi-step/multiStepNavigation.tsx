import { cn } from "@/lib/utils.ts";
import { useMultiStep } from "./multiStepContext.tsx";
import { NavigationButton } from "./components/navigationButton.tsx";
import { isLastStep } from "./utils/isLastStep.ts";

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
  onSubmit?: () => void | Promise<void>;
  /** Show icons on buttons */
  showIcons?: boolean;
}

/**
 * Navigation controls for multi-step forms
 * Provides Previous, Next, and Submit buttons with appropriate states
 * Uses semantic HTML nav element with accessible navigation buttons
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

  const isOnLastStep = isLastStep(currentStep, totalSteps);

  const handleNext = async () => {
    if (isOnLastStep && onSubmit) {
      await onSubmit();
    } else {
      await goNext();
    }
  };

  return (
    <nav
      className={cn(
        "flex items-center justify-between gap-4 mt-6",
        className,
      )}
      aria-label="Form navigation"
    >
      {/* Previous Button */}
      {!hidePrevious && (
        <NavigationButton
          type="previous"
          label={previousLabel}
          onClick={goPrevious}
          disabled={!canGoPrevious}
          showIcon={showIcons}
        />
      )}

      {/* Next / Submit Button */}
      <NavigationButton
        type={isOnLastStep ? "submit" : "next"}
        label={isOnLastStep ? submitLabel : nextLabel}
        onClick={handleNext}
        disabled={!canGoNext}
        showIcon={showIcons}
        className="ml-auto"
      />
    </nav>
  );
}
