import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Children, cloneElement, isValidElement, ReactNode } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitaliseFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function spaceToNonBreakingSpace(string: string) {
  return string.replace(/ /g, "\u00A0");
}

/**
 * Safely converts children to an array
 * Wrapper around React.Children.toArray for type safety
 */
export function getChildArray(children: ReactNode): ReactNode[] {
  return Children.toArray(children);
}

/**
 * Clone a React element and inject additional props
 * Type-safe wrapper around React.cloneElement
 */
export function cloneElementWithProps<P = Record<string, unknown>>(
  element: ReactNode,
  props: Partial<P>,
): ReactNode {
  if (isValidElement(element)) {
    // deno-lint-ignore no-explicit-any
    return cloneElement(element, props as any);
  }
  return element;
}
