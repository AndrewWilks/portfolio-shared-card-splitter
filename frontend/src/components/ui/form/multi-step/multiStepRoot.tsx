import { useCallback, useMemo, useState } from "react";
import {
  MultiStepContext,
  MultiStepContextValue,
} from "./multiStepContext.tsx";
import { useStepValidation } from "./hooks/useStepValidation.ts";
import { useStepNavigation } from "./hooks/useStepNavigation.ts";

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

/**
 * Root component for multi-step forms
 * Provides context and manages state for navigation and validation
 * Uses semantic HTML form element with appropriate ARIA attributes
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
    new Set(),
  );
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(
    new Set([initialStep]), // Mark initial step as visited
  );

  // Use extracted validation hook
  const {
    registerStepValidation,
    unregisterStepValidation,
    isStepValid,
    validationFns,
  } = useStepValidation();

  const markStepComplete = useCallback((step: number) => {
    setCompletedSteps((prev) => new Set(prev).add(step));
  }, []);

  // Use extracted navigation hook
  const {
    goNext,
    goPrevious,
    goToStep,
    canGoNext,
    canGoPrevious,
  } = useStepNavigation({
    currentStep,
    totalSteps,
    isStepValid,
    markStepComplete,
    onStepChange,
    onComplete,
    setCurrentStep,
    setVisitedSteps,
    validationFns,
  });

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
    ],
  );

  return (
    <MultiStepContext.Provider value={contextValue}>
      <article className={className} role="form" aria-label="Multi-step form">
        {children}
      </article>
    </MultiStepContext.Provider>
  );
}
