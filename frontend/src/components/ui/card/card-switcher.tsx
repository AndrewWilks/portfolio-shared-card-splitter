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
import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { CardLogoType, CardIcon } from "./card-icon.tsx";

type Card = {
  id: string;
  name: string;
  type: CardLogoType;
  last4: string | null;
};

interface CardSwitcherProps {
  cards: Card[];
}

// TODO: Replace with real data fetching with the card service
const data: Card[] = [
  {
    id: "1",
    name: "Personal Card",
    type: "visa",
    last4: "1234",
  },
  { id: "2", name: "Business Card", type: "mastercard", last4: "5678" },
  { id: "3", name: "Travel Card", type: "amex", last4: "9012" },
  { id: "4", name: "Backup Card", type: "mastercard", last4: "3456" },
  { id: "5", name: "Old Card", type: "visa", last4: "7890" },
  { id: "6", name: "New Card", type: "mastercard", last4: "1122" },
  { id: "7", name: "Family Card", type: "amex", last4: "3344" },
  { id: "8", name: "Work Card", type: "mastercard", last4: "5566" },
  { id: "9", name: "Holiday Card", type: "visa", last4: "7788" },
  { id: "10", name: "Shopping Card", type: "mastercard", last4: "9900" },
  { id: "11", name: "Dining Card", type: "amex", last4: "2233" },
];

export function CardSwitcher({ cards }: CardSwitcherProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { cardId } = useParams({
    strict: false,
  });

  cards = data; // For demo purposes

  const _cardId = useMemo(() => {
    if (cardId) return cardId;
    const lastSelectedCardId =
      globalThis.cookieStore?.get("lastSelectedCardId");
    if (lastSelectedCardId) return lastSelectedCardId;
    if (cards.length > 0) return cards[0].id;
    return "default";
  }, [cardId, cards]);

  const activeCard = useMemo(() => {
    return (
      cards.find((card) => card.id === _cardId) ||
      ({
        id: "default",
        name: "Select a Card",
        type: "default",
        last4: null,
      } as Card)
    );
  }, [cards, cardId]);

  const handleSelectCard = useCallback((id: string) => {
    globalThis.cookieStore?.set("lastSelectedCardId", id);
    navigate({
      to: `/dashboard/${id}`,
    });
  }, []);

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
                className="!size-8 aspect-video shrink-0 mr-1"
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
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
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
                <CardIcon type={card.type} className="!size-6 shrink-0" />
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
            <DropdownMenuItem className="gap-2 p-1">
              <div className="flex size-4 items-center justify-center rounded-md border bg-transparent">
                <Plus />
              </div>
              <div className="text-muted-foreground font-medium">Add Card</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
