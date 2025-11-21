/**
 * Determine if navigation to a target step is allowed
 */
export function canNavigateToStep(
  targetStep: number,
  currentStep: number,
  visitedSteps: Set<number>,
  isCurrentValid: boolean,
): boolean {
  // Can navigate to visited steps
  if (visitedSteps.has(targetStep)) {
    return true;
  }

  // Can navigate to next step if current is valid
  const isNextStep = targetStep === currentStep + 1;
  if (isNextStep && isCurrentValid) {
    return true;
  }

  return false;
}
