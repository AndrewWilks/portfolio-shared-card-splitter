import { cn } from "@/lib/utils.ts";
import * as assets from "./assets/icon/index.tsx";
import { CardLogoType } from "./assets/icon/index.tsx";
import { createElement } from "react";

export interface CardIconProps {
  type: assets.CardLogoType;
}

export function CardIcon({
  type,
  className,
  ...props
}: CardIconProps & React.ComponentProps<"svg">) {
  return createElement(assets.Logos[type], {
    className: cn("size-4", className),
    ...props,
  });
}

export type { CardLogoType };
export { assets };
