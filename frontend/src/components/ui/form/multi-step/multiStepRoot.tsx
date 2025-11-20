import { useState, useCallback, useRef, useMemo } from "react";
import { MultiStepContext, MultiStepContextValue } from "./multiStepContext.tsx";

export interface MultiStepRootProps {
  /** Total number of steps */
  totalSteps: number;
  /** Initial step index (default: 0) */
  initialStep?: number;
  /** Callback when all steps are completed */
  onComplete?: () => void;
  /** Callback when step changes */
  onStepChange?: (step: number) => void;
  /** Children components */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

// TODO: Use more semantic html tags
// TODO: Code Split into multiple files and follow solid principles

/**
 * Root component for multi-step forms
 * Provides context and manages state for navigation and validation
 */
export function MultiStepRoot({
  totalSteps,
  initialStep = 0,
  onComplete,
  onStepChange,
  children,
  className,
}: MultiStepRootProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set()
  );
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(
    new Set([initialStep]) // Mark initial step as visited
  );

  // Store validation functions and failure callbacks for each step
  const validationFns = useRef<
    Map<number, { validator: () => boolean; onFailed?: () => void }>
  >(new Map());

  const registerStepValidation = useCallback(
    (
      step: number,
      validator: () => boolean,
      onValidationFailed?: () => void
    ) => {
      validationFns.current.set(step, { validator, onFailed: onValidationFailed });
    },
    []
  );

  const unregisterStepValidation = useCallback((step: number) => {
    validationFns.current.delete(step);
  }, []);

  const isStepValid = useCallback((step: number): boolean => {
    const entry = validationFns.current.get(step);
    return entry ? entry.validator() : true;
  }, []);

  const markStepComplete = useCallback((step: number) => {
    setCompletedSteps((prev) => new Set(prev).add(step));
  }, []);

  const goToStep = useCallback(
    (step: number) => {
      if (step < 0 || step >= totalSteps) {
        console.warn(`Invalid step index: ${step}`);
        return;
      }

      // If navigating forward and current step is valid, mark it as complete
      if (step > currentStep && isStepValid(currentStep)) {
        markStepComplete(currentStep);
      }

      setCurrentStep(step);
      setVisitedSteps((prev) => new Set(prev).add(step)); // Mark step as visited
      onStepChange?.(step);
    },
    [totalSteps, currentStep, isStepValid, markStepComplete, onStepChange]
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
  }, [currentStep, totalSteps, isStepValid, markStepComplete, goToStep, onComplete]);

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

  const contextValue: MultiStepContextValue = useMemo(
    () => ({
      currentStep,
      totalSteps,
      goNext,
      goPrevious,
      goToStep,
      canGoNext,
      canGoPrevious,
      isStepValid,
      markStepComplete,
      completedSteps,
      visitedSteps,
      registerStepValidation,
      unregisterStepValidation,
    }),
    [
      currentStep,
      totalSteps,
      goNext,
      goPrevious,
      goToStep,
      canGoNext,
      canGoPrevious,
      isStepValid,
      markStepComplete,
      completedSteps,
      visitedSteps,
      registerStepValidation,
      unregisterStepValidation,
    ]
  );

  return (
    <MultiStepContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </MultiStepContext.Provider>
  );
}
