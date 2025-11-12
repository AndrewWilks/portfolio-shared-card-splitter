import { BreakpointProvider } from "./breakpoints.tsx";
import { ThemeProvider } from "./theme.tsx";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <BreakpointProvider>{children}</BreakpointProvider>
    </ThemeProvider>
  );
}
