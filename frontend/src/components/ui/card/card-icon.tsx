import { cn } from "@/lib/utils.ts";
import * as assets from "./assets/rounded/index.tsx";
import { CardRoundedType } from "./assets/rounded/index.tsx";
import { createElement } from "react";

export interface CardIconProps {
  type: assets.CardRoundedType;
}

export function CardIcon({
  type,
  className,
  ...props
}: CardIconProps & React.ComponentProps<"svg">) {
  return createElement(assets.rounded[type], {
    className: cn("size-4", className),
    ...props,
  });
}

export type { CardRoundedType as CardLogoType };
export { assets };
