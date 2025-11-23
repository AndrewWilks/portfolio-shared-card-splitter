import { BreakpointProvider } from "./breakpoint.tsx";
import { ThemeProvider } from "./theme.tsx";
import { CardProvider } from "./card.tsx";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BreakpointProvider>
        <CardProvider>
          {children}
        </CardProvider>
      </BreakpointProvider>
    </ThemeProvider>
  );
}
