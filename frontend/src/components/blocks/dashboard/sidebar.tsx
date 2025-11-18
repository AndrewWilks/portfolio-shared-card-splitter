import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar/index.tsx";
import { useLocation } from "@tanstack/react-router";
import { Link, LinkProps } from "@tanstack/react-router";
import { icons, Wallet } from "lucide-react";
import { NavUser } from "../../ui/user/nav.tsx";
import { useAuth } from "../../../auth/AuthContext.tsx";
import { CardSwitcher } from "../../ui/card/card-switcher.tsx";

type NavItem = {
  title: string;
  to: LinkProps["to"];
  icon: keyof typeof icons;
};

const mainNav: NavItem[] = [
  { title: "Dashboard", to: "/dashboard", icon: "House" },
];

export function DashboardSidebar() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  return (
    <Sidebar collapsible="icon" variant="floating" className="">
      <SidebarHeader className="border-b mb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Wallet />
            <span className="text-lg font-semibold leading-none">
              FairShare
            </span>
          </SidebarMenuItem>
        </SidebarMenu>
        <CardSwitcher cards={[]} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="gap-2">
          {mainNav.map((item) => {
            const Icon = icons[item.icon];
            const isActive = location.pathname === item.to;
            return (
              <SidebarMenuButton key={item.title} asChild isActive={isActive}>
                <Link to={item.to}>
                  <Icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            );
          })}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t mt-2">
        {isAuthenticated && (
          <NavUser
            user={{
              firstName: user!.firstName,
              lastName: user!.lastName,
              email: user!.email,
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
