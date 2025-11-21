/**
 * Check if the current step is the last step
 */

export function isLastStep(currentStep: number, totalSteps: number): boolean {
  return currentStep === totalSteps - 1;
}
