import { useCallback, useMemo } from "react";

export interface UseStepNavigationParams {
  currentStep: number;
  totalSteps: number;
  isStepValid: (step: number) => boolean;
  markStepComplete: (step: number) => void;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
  setCurrentStep: (step: number) => void;
  setVisitedSteps: React.Dispatch<React.SetStateAction<Set<number>>>;
  validationFns: React.RefObject<
    Map<number, { validator: () => boolean; onFailed?: () => void }>
  >;
}

export interface UseStepNavigationResult {
  goNext: () => void;
  goPrevious: () => void;
  goToStep: (step: number) => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

/**
 * Custom hook for multi-step navigation logic
 * Handles navigation between steps with validation
 */
export function useStepNavigation({
  currentStep,
  totalSteps,
  isStepValid,
  markStepComplete,
  onStepChange,
  onComplete,
  setCurrentStep,
  setVisitedSteps,
  validationFns,
}: UseStepNavigationParams): UseStepNavigationResult {
  const goToStep = useCallback(
    (step: number) => {
      if (step < 0 || step >= totalSteps) {
        console.warn(`Invalid step index: ${step}`);
        return;
      }

      // If navigating forward, validate current step first
      if (step > currentStep) {
        if (!isStepValid(currentStep)) {
          // Trigger validation failed callback
          const entry = validationFns.current?.get(currentStep);
          entry?.onFailed?.();
          return; // Block navigation
        }
        // Current step is valid, mark it as complete
        markStepComplete(currentStep);
      }

      // Allow navigation (backward or validated forward)
      setCurrentStep(step);
      setVisitedSteps((prev) => new Set(prev).add(step)); // Mark step as visited
      onStepChange?.(step);
    },
    [
      totalSteps,
      currentStep,
      isStepValid,
      markStepComplete,
      onStepChange,
      setCurrentStep,
      setVisitedSteps,
      validationFns,
    ],
  );

  const goNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      // Validate current step before proceeding
      if (isStepValid(currentStep)) {
        markStepComplete(currentStep);
        goToStep(currentStep + 1);
      } else {
        // Trigger validation failed callback
        const entry = validationFns.current.get(currentStep);
        entry?.onFailed?.();
      }
    } else if (currentStep === totalSteps - 1) {
      // On last step, trigger completion
      if (isStepValid(currentStep)) {
        markStepComplete(currentStep);
        onComplete?.();
      } else {
        // Trigger validation failed callback
        const entry = validationFns.current.get(currentStep);
        entry?.onFailed?.();
      }
    }
  }, [
    currentStep,
    totalSteps,
    isStepValid,
    markStepComplete,
    goToStep,
    onComplete,
    validationFns,
  ]);

  const goPrevious = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  const canGoNext = useMemo(() => {
    return currentStep < totalSteps && isStepValid(currentStep);
  }, [currentStep, totalSteps, isStepValid]);

  const canGoPrevious = useMemo(() => {
    return currentStep > 0;
  }, [currentStep]);

  return {
    goNext,
    goPrevious,
    goToStep,
    canGoNext,
    canGoPrevious,
  };
}
