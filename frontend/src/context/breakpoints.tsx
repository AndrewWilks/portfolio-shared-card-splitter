import React from "react";
import { useMediaQuery } from "react-responsive";

export const BreakpointContext = React.createContext<{
  /**
   * Extra Small: ≤575px for phones
   */
  isXs: boolean;
  /**
   * Small: ≤767px for tablets
   */
  isSm: boolean;
  /**
   * Medium: ≤991px for small laptops
   */
  isMd: boolean;
  /**
   * Large: ≤1199px for laptops and desktops
   */
  isLg: boolean;
  /**
   * Extra Large: ≤1599px for larger desktops
   */
  isXl: boolean;
  /**
   * Extra Extra Large: ≥1600px for very large screens
   */
  isXXl: boolean;
} | null>(null);

export function BreakpointProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isXs = useMediaQuery({ maxWidth: 575 });
  const isSm = useMediaQuery({ maxWidth: 767 });
  const isMd = useMediaQuery({ maxWidth: 991 });
  const isLg = useMediaQuery({ maxWidth: 1199 });
  const isXl = useMediaQuery({ maxWidth: 1599 });
  const isXXl = useMediaQuery({ minWidth: 1600 });

  const breakpoints = {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isXXl,
  };

  return (
    <BreakpointContext.Provider value={breakpoints}>
      {children}
    </BreakpointContext.Provider>
  );
}

export function useBreakpointContext() {
  const context = React.useContext(BreakpointContext);
  if (!context) {
    throw new Error(
      "useBreakpointContext must be used within a BreakpointProvider"
    );
  }
  return context;
}
