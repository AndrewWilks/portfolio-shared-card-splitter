/**
 * Multi-Step Form Components
 * 
 * A reusable system for building multi-step forms and wizards.
 * Supports form validation, arbitrary content, and flexible navigation.
 * 
 * @example
 * ```tsx
 * import {
 *   MultiStepRoot,
 *   MultiStepProgress,
 *   MultiStepContent,
 *   MultiStepNavigation,
 *   useMultiStep
 * } from '@/components/ui/form/multi-step';
 * 
 * function MyWizard() {
 *   return (
 *     <MultiStepRoot totalSteps={3} onComplete={handleComplete}>
 *       <MultiStepProgress labels={['Info', 'Details', 'Review']} />
 *       <MultiStepContent>
 *         <Step1 />
 *         <Step2 />
 *         <Step3 />
 *       </MultiStepContent>
 *       <MultiStepNavigation />
 *     </MultiStepRoot>
 *   );
 * }
 * ```
 */

export { MultiStepRoot } from "./multiStepRoot.tsx";
export type { MultiStepRootProps } from "./multiStepRoot.tsx";

export { MultiStepProgress } from "./multiStepProgress.tsx";
export type { MultiStepProgressProps } from "./multiStepProgress.tsx";

export { MultiStepContent } from "./multiStepContent.tsx";
export type { MultiStepContentProps } from "./multiStepContent.tsx";

export { MultiStepNavigation } from "./multiStepNavigation.tsx";
export type { MultiStepNavigationProps } from "./multiStepNavigation.tsx";

export { useMultiStep } from "./multiStepContext.tsx";
export type { MultiStepContextValue } from "./multiStepContext.tsx";
