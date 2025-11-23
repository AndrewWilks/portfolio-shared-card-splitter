import { createFileRoute } from "@tanstack/react-router";
import { useCards } from "@/context/card.tsx";
import { CardIcon, CardLogoType } from "@/components/ui/card/card-icon.tsx";
import { CreditCard } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/$cardId/")({
  component: CardDashboard,
});

function CardDashboard() {
  const { selectedCard, isLoading } = useCards();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary">
          </div>
          <p className="text-muted-foreground">Loading card information...</p>
        </div>
      </div>
    );
  }

  if (!selectedCard) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <CreditCard className="size-12 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-semibold">No Card Selected</h2>
          <p className="text-muted-foreground">
            Please select a card from the sidebar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Card Header */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-4">
          <CardIcon
            type={selectedCard.type as CardLogoType}
            className="size-16! shrink-0"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{selectedCard.name}</h1>
            <p className="text-muted-foreground">
              {selectedCard.type.toUpperCase()} •••• {selectedCard.last4}
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <p className="text-muted-foreground">
          Transaction tracking will be implemented in future phases.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-2">Monthly Spending</h3>
          <p className="text-muted-foreground text-sm">
            Spending analytics will be available soon.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-2">Split Summary</h3>
          <p className="text-muted-foreground text-sm">
            View splits and settlements here.
          </p>
        </div>
      </div>
    </div>
  );
}
