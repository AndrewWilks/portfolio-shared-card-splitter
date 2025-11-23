"use client";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar/index.tsx";

import { useIsMobile } from "@/hooks/useIsMobile.tsx";
import { capitaliseFirstLetter, spaceToNonBreakingSpace } from "@/lib/utils.ts";
import { Link } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { CardIcon, CardLogoType } from "./card-icon.tsx";
import { useCards } from "@/context/card.tsx";

export function CardSwitcher() {
  const isMobile = useIsMobile();
  const { cards, selectedCard, selectCard, isLoading } = useCards();

  const activeCard = useMemo(() => {
    if (selectedCard) {
      return {
        id: selectedCard.id,
        name: selectedCard.name,
        type: selectedCard.type as CardLogoType,
        last4: selectedCard.last4,
      };
    }

    // Default card when none selected
    return {
      id: "default",
      name: "Select a Card",
      type: "default" as CardLogoType,
      last4: null,
    };
  }, [selectedCard]);

  const handleSelectCard = useCallback(
    (id: string) => {
      selectCard(id);
    },
    [selectCard],
  );

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Loading...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <CardIcon
                type={activeCard.type}
                className="size-8! aspect-video shrink-0 mr-1"
              />

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeCard.name}</span>
                <span className="text-xs text-muted-foreground">
                  {activeCard.last4
                    ? capitaliseFirstLetter(`•••• ${activeCard.last4} - `)
                    : ""}
                  {capitaliseFirstLetter(activeCard.type)}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Cards
            </DropdownMenuLabel>
            {cards.map((card) => (
              <DropdownMenuItem
                key={card.id}
                onClick={() => handleSelectCard(card.id)}
                className="gap-2 p-2"
              >
                <CardIcon
                  type={card.type as CardLogoType}
                  className="size-6! shrink-0"
                />
                <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                  {spaceToNonBreakingSpace(card.name)}
                </span>
                <small className="ml-auto">
                  {card.last4
                    ? spaceToNonBreakingSpace(`•••• ${card.last4}`)
                    : ""}
                </small>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="gap-2 p-1">
              {/* @ts-ignore - route will be created next */}
              <Link to="/dashboard/create-card">
                <div className="flex size-4 items-center justify-center rounded-md border bg-transparent">
                  <Plus />
                </div>
                <div className="text-muted-foreground font-medium">
                  Add Card
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
