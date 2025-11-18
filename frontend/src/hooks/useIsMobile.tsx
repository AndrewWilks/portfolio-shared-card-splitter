import { useBreakpoints } from "./useBreakpoints.tsx";

export function useIsMobile() {
  const breakpoints = useBreakpoints();
  return breakpoints.isSm;
}
