import { cn } from "@/lib/utils.ts";

export interface StepConnectorProps {
  /** Whether the step before this connector is completed */
  isCompleted: boolean;
  /** Orientation of the connector */
  orientation?: "horizontal" | "vertical";
  /** Additional CSS classes */
  className?: string;
}

/**
 * A reusable connector line between steps
 * Uses semantic HR element with appropriate styling
 * Can be used in any step-based UI workflow
 */
export function StepConnector({
  isCompleted,
  orientation = "horizontal",
  className,
}: StepConnectorProps) {
  return (
    <hr
      className={cn(
        "border-0 transition-all duration-300 rounded-full",
        orientation === "horizontal" &&
          "h-1 flex-1 min-w-4 max-w-16 mx-4 md:mx-6 md:mb-6",
        orientation === "vertical" &&
          "w-1 flex-1 min-h-4 max-h-16 my-4 md:my-6",
        isCompleted ? "bg-primary shadow-sm" : "bg-border",
        className,
      )}
      aria-hidden="true"
    />
  );
}
