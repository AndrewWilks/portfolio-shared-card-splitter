import { useBreakpointContext } from "../../../context/breakpoints.tsx";
import NavDesktop from "./desktop.tsx";
import NavMobile from "./mobile.tsx";

export default function Nav() {
  const breakpoints = useBreakpointContext();
  const isMobile = breakpoints.isMd;

  return <>{isMobile ? <NavMobile /> : <NavDesktop />}</>;
}
