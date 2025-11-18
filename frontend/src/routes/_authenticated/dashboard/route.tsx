import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardSidebar } from "@/components/blocks/dashboard/sidebar.tsx";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar/index.tsx";
import { ModeToggle } from "@/components/ui/theme/mode-toggle.tsx";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const defaultOpen = document.cookie.includes("sidebar_state=true") || false;
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      {/* Dashboard Sidebar */}
      <DashboardSidebar />
      <div className="relative w-full">
        <header className="sticky top-0 z-20 border-b pt-4 pb-3 pl-2 pr-4 bg-background">
          <SidebarTrigger />
          <ModeToggle className="ml-2" />
        </header>
        <main className="px-4 pt-2 pb-6 h-[200vh]">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
