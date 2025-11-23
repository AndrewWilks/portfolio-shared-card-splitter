import { Check, ChevronLeft, ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/primitives/button.tsx";

export type NavigationButtonType = "previous" | "next" | "submit";

export interface NavigationButtonProps {
  /** Type of navigation button */
  type: NavigationButtonType;
  /** Label text for the button */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether to show the icon */
  showIcon?: boolean;
  /** Custom icon (overrides default) */
  icon?: LucideIcon;
  /** Additional CSS classes */
  className?: string;
  /** Button variant */
  variant?: "default" | "outline" | "ghost";
}

/**
 * Navigation button for multi-step forms
 * Handles rendering of Previous, Next, and Submit buttons with appropriate icons
 */
export function NavigationButton({
  type,
  label,
  onClick,
  disabled = false,
  showIcon = true,
  icon: CustomIcon,
  className,
  variant,
}: NavigationButtonProps) {
  // Determine default icon based on type
  const DefaultIcon = type === "previous"
    ? ChevronLeft
    : type === "submit"
    ? Check
    : ChevronRight;

  const Icon = CustomIcon || DefaultIcon;
  const iconPosition = type === "previous" ? "left" : "right";

  // Use outline for previous, default for next/submit
  const buttonVariant = variant ||
    (type === "previous" ? "outline" : "default");

  return (
    <Button
      type="button"
      variant={buttonVariant}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        type === "previous" && disabled && "invisible",
        className,
      )}
    >
      {showIcon && iconPosition === "left" && <Icon className="size-4" />}
      {label}
      {showIcon && iconPosition === "right" && <Icon className="size-4" />}
    </Button>
  );
}
