import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "@tanstack/react-router";
import { Card } from "@shared/entities/card.ts";
import { CardService } from "../services/CardService.ts";
import { ApiError } from "@shared/entities/api/apiError.ts";
import { useAuth } from "../auth/AuthContext.tsx";

interface CardContextValue {
  cards: Card[];
  selectedCard: Card | null;
  isLoading: boolean;
  selectCard: (cardId: string) => void;
  refreshCards: () => Promise<void>;
}

const CardContext = createContext<CardContextValue | undefined>(undefined);

export function CardProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  /**
   * Fetch all cards for the authenticated user
   */
  const refreshCards = useCallback(async () => {
    if (!isAuthenticated) {
      setCards([]);
      setSelectedCard(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const result = await CardService.getCards();

    if (result instanceof ApiError) {
      console.error("Failed to fetch cards:", result);
      setCards([]);
      setSelectedCard(null);
      setIsLoading(false);
      return;
    }

    setCards(result);

    // Handle card selection logic
    if (result.length === 0) {
      // No cards - redirect to create-card page
      setSelectedCard(null);
      // @ts-ignore - route will be created next
      navigate({ to: "/dashboard/create-card" });
    } else {
      // Try to select card from localStorage
      const storedCardId = localStorage.getItem("selectedCardId");
      let cardToSelect: Card | null = null;

      if (storedCardId) {
        cardToSelect = result.find((c: Card) => c.id === storedCardId) || null;
      }

      // If no stored card or stored card not found, select first card
      if (!cardToSelect) {
        cardToSelect = result[0];
        localStorage.setItem("selectedCardId", cardToSelect.id);
      }

      setSelectedCard(cardToSelect);
      // Navigate to the selected card's dashboard
      navigate({ to: `/dashboard/${cardToSelect.id}` });
    }

    setIsLoading(false);
  }, [isAuthenticated, navigate]);

  /**
   * Select a specific card by ID
   */
  const selectCard = useCallback(
    (cardId: string) => {
      const card = cards.find((c: Card) => c.id === cardId);
      if (!card) {
        console.error(`Card with ID ${cardId} not found`);
        return;
      }

      setSelectedCard(card);
      localStorage.setItem("selectedCardId", cardId);
      navigate({ to: `/dashboard/${cardId}` });
    },
    [cards, navigate],
  );

  // Fetch cards on mount and when user changes
  useEffect(() => {
    refreshCards();
  }, [refreshCards, user?.id]);

  const value: CardContextValue = {
    cards,
    selectedCard,
    isLoading,
    selectCard,
    refreshCards,
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
}

/**
 * Hook to access card context
 */
export function useCards() {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("useCards must be used within a CardProvider");
  }
  return context;
}
