import { useBreakpoints } from "@/hooks/useBreakpoints.tsx";
import NavDesktop from "./desktop.tsx";
import NavMobile from "./mobile.tsx";

export default function Nav() {
  const breakpoints = useBreakpoints();
  const isMobile = breakpoints.isMd;

  return <>{isMobile ? <NavMobile /> : <NavDesktop />}</>;
}
