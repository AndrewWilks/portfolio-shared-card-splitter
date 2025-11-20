import { createContext, useContext } from "react";

/**
 * Multi-step form context value interface
 */
export interface MultiStepContextValue {
  /** Current active step index (0-based) */
  currentStep: number;
  /** Total number of steps in the form */
  totalSteps: number;
  /** Navigate to the next step */
  goNext: () => void;
  /** Navigate to the previous step */
  goPrevious: () => void;
  /** Navigate to a specific step */
  goToStep: (step: number) => void;
  /** Whether navigation to next step is allowed */
  canGoNext: boolean;
  /** Whether navigation to previous step is allowed */
  canGoPrevious: boolean;
  /** Check if a specific step is valid */
  isStepValid: (step: number) => boolean;
  /** Mark a step as complete */
  markStepComplete: (step: number) => void;
  /** Set of completed step indices */
  completedSteps: Set<number>;
  /** Set of visited step indices */
  visitedSteps: Set<number>;
  /** Register a validation function for a step */
  registerStepValidation: (
    step: number,
    validator: () => boolean,
    onValidationFailed?: () => void
  ) => void;
  /** Unregister a validation function for a step */
  unregisterStepValidation: (step: number) => void;
}

/**
 * Multi-step form context
 */
export const MultiStepContext = createContext<MultiStepContextValue | null>(
  null
);

/**
 * Hook to access multi-step form context
 * @throws Error if used outside of MultiStepRoot
 */
export function useMultiStep(): MultiStepContextValue {
  const context = useContext(MultiStepContext);
  if (!context) {
    throw new Error("useMultiStep must be used within a MultiStepRoot");
  }
  return context;
}
