"use client";

import { api } from "@/lib/api/react";
import { useEffect, useState } from "react";
import { CardFilters, type FilterState } from "./card-filters";
import { CardGrid } from "./card-grid";

type CardBrowserProps = {
  selectedCards: Set<string>;
  onCardToggle: (cardId: string) => void;
};

export function CardBrowser({ selectedCards, onCardToggle }: CardBrowserProps) {
  const [filters, setFilters] = useState<FilterState>({
    setId: "",
    rarity: "",
    search: "",
    releaseDateFrom: "",
    releaseDateTo: "",
  });
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout | null>(
    null
  );

  const {
    data: cardListData,
    isLoading,
    refetch: fetchCards,
  } = api.card.getList.useQuery();
  const cards = cardListData || [];

  // Handle filter changes with debounce for search
  useEffect(() => {
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }

    const timeout = setTimeout(
      () => {
        fetchCards();
      },
      filters.search ? 500 : 0
    ); // Debounce search by 500ms

    setSearchDebounce(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div className="space-y-6">
      <CardFilters onFilterChange={setFilters} />

      <CardGrid
        cards={cards}
        selectedCards={selectedCards}
        onCardToggle={onCardToggle}
        isLoading={isLoading}
      />
    </div>
  );
}
