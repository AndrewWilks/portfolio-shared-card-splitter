import { Children, isValidElement, cloneElement } from "react";
import { cn } from "@/lib/utils.ts";
import { useMultiStep } from "./multiStepContext.tsx";

export interface MultiStepContentProps {
  /** Child components (one per step) */
  children: React.ReactNode;
  /** Additional CSS classes for the container */
  className?: string;
  /** Animation style: 'fade' | 'slide' | 'none' */
  animation?: "fade" | "slide" | "none";
}

// TODO: Use more semantic html tags

/**
 * Container for multi-step form content
 * Renders only the active step's content
 * Supports fade and slide transitions
 */
export function MultiStepContent({
  children,
  className,
  animation = "fade",
}: MultiStepContentProps) {
  const { currentStep } = useMultiStep();

  const childArray = Children.toArray(children);

  if (currentStep >= childArray.length) {
    console.warn(
      `Current step ${currentStep} exceeds number of children ${childArray.length}`
    );
    return null;
  }

  const activeChild = childArray[currentStep];

  // Clone the child and inject step metadata as props if it's a valid element
  const childWithProps = isValidElement(activeChild)
    ? cloneElement(activeChild, {
        stepIndex: currentStep,
        isActive: true,
      } as any)
    : activeChild;

  return (
    <div
      className={cn(
        "w-full",
        animation === "fade" && "animate-in fade-in duration-300",
        animation === "slide" && "animate-in slide-in-from-right-4 duration-300",
        className
      )}
      key={currentStep} // Key forces re-mount for animations
    >
      {childWithProps}
    </div>
  );
}
