import { BreakpointProvider } from "./breakpoint.tsx";
import { ThemeProvider } from "./theme.tsx";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BreakpointProvider>{children}</BreakpointProvider>
    </ThemeProvider>
  );
}
