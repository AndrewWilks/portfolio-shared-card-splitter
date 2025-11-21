import { StepStatus } from "@/components/ui/primitives/stepIndicator.tsx";

/**
 * Determine the status of a step based on its relationship to the current step
 */

export function getStepStatus(
  step: number,
  currentStep: number,
  completedSteps: Set<number>,
  visitedSteps: Set<number>,
): StepStatus {
  if (step === currentStep) {
    return "active";
  }
  if (completedSteps.has(step)) {
    return "completed";
  }
  if (visitedSteps.has(step)) {
    return "visited";
  }
  return "future";
}
