import { Check } from "lucide-react";
import { cn } from "@/lib/utils.ts";

export type StepStatus = "active" | "completed" | "visited" | "future";

export interface StepIndicatorProps {
  /** The step number to display (1-indexed for display) */
  stepNumber: number;
  /** The label for this step */
  label: string;
  /** Current status of the step */
  status: StepStatus;
  /** Whether this step can be clicked */
  isClickable: boolean;
  /** Callback when step is clicked */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

/**
 * A reusable step indicator component
 * Displays a numbered circle that can show completion status
 * Can be used in any step-based UI workflow
 */
export function StepIndicator({
  stepNumber,
  label,
  status,
  isClickable,
  onClick,
  className,
  size = "md",
}: StepIndicatorProps) {
  const isActive = status === "active";
  const isCompleted = status === "completed";
  const isVisited = status === "visited";
  const isFuture = status === "future";

  const sizeClasses = {
    sm: "size-6 text-sm",
    md: "size-8 md:size-12 text-base md:text-lg",
    lg: "size-12 md:size-16 text-lg md:text-xl",
  };

  return (
    <button
      type="button"
      onClick={() => isClickable && onClick?.()}
      disabled={!isClickable}
      className={cn(
        "flex items-center justify-center rounded-full transition-all duration-200",
        sizeClasses[size],
        "font-bold shadow-sm",
        isActive &&
          "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110",
        isCompleted && !isActive &&
          "bg-primary text-primary-foreground hover:bg-primary/90",
        isVisited && !isCompleted && !isActive &&
          "bg-primary/80 text-primary-foreground hover:bg-primary",
        isFuture && !isClickable &&
          "bg-muted text-muted-foreground border-2 border-border opacity-50",
        isFuture && isClickable &&
          "bg-muted text-muted-foreground border-2 border-primary/30 hover:border-primary/50 hover:bg-muted/80",
        isClickable && "cursor-pointer hover:scale-105",
        !isClickable && "cursor-default",
        className,
      )}
      aria-label={label}
      aria-current={isActive ? "step" : undefined}
    >
      {isCompleted && !isActive
        ? <Check className="size-5 md:size-6" />
        : <span>{stepNumber}</span>}
    </button>
  );
}
