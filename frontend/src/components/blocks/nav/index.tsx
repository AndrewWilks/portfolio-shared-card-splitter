import { useBreakpoints } from "../../../context/breakpoints.tsx";
import NavDesktop from "./desktop.tsx";
import NavMobile from "./mobile.tsx";

export default function Nav() {
  const breakpoints = useBreakpoints();
  const isMobile = breakpoints.isMd;

  return <>{isMobile ? <NavMobile /> : <NavDesktop />}</>;
}
