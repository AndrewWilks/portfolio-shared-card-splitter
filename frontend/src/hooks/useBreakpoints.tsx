import React from "react";
import { BreakpointContext } from "../context/breakpoint.tsx";

export function useBreakpoints() {
  const context = React.useContext(BreakpointContext);
  if (!context) {
    throw new Error("useBreakpoints must be used within a BreakpointProvider");
  }
  return context;
}
