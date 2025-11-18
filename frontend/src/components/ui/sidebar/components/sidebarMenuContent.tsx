import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { useSidebar } from "../index.tsx";
import { cn } from "@/lib/utils.ts";
import {
  TooltipContent,
  Tooltip,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

export function SidebarMenuContent({
  className,
  size = "default",
  tooltip,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuContentVariants>) {
  const { isMobile, state } = useSidebar();

  const content = (
    <div
      data-slot="sidebar-menu-content"
      data-sidebar="menu-content"
      data-size={size}
      className={cn(sidebarMenuContentVariants({ size }), className)}
      {...props}
    >
      {children}
    </div>
  );

  if (!tooltip) {
    return content;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  );
}

const sidebarMenuContentVariants = cva(
  "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm transition-[width,height,padding] group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);
