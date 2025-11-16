import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useBreakpoints } from "@/context/breakpoints.tsx";
import { useMemo } from "react";
import classNames from "classnames";
import { Sidebar } from "@/components/blocks/dashboard/sidebar/index.tsx";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isXs, isSm, isMd } = useBreakpoints();

  const isMobile = useMemo(() => isXs || isSm || isMd, [isXs, isSm, isMd]);
  const isDesktop = useMemo(() => !isMobile, [isMobile]);

  const containerClasses = useMemo(() => {
    return classNames("flex h-full", {
      "flex-col bg-red-900": isMobile,
      "flex-row bg-green-900": isDesktop,
    });
  }, [isMobile, isDesktop]);

  return (
    <div className={containerClasses}>
      {/* App Sidebar */}
      {isDesktop && <Sidebar />}
      <main className="flex-1 p-4 overflow-auto">
        <Outlet />
      </main>
      {isMobile && <Dock />}
    </div>
  );
}

function Dock() {
  return <footer>Dock</footer>;
}
