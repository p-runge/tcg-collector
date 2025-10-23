"use client";

import type { Card } from "@/lib/db";
import { useCallback, useEffect, useState } from "react";
import { CardFilters, type FilterState } from "./card-filters";
import { CardGrid } from "./card-grid";

type CardBrowserProps = {
  selectedCards: Set<string>;
  onCardToggle: (cardId: string) => void;
};

export function CardBrowser({ selectedCards, onCardToggle }: CardBrowserProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
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

  const fetchCards = useCallback(
    async (reset = false) => {
      if (isLoading) return;

      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          limit: "50",
          ...(reset ? {} : cursor ? { cursor } : {}),
          ...(filters.setId && { setId: filters.setId }),
          ...(filters.rarity && { rarity: filters.rarity }),
          ...(filters.search && { search: filters.search }),
          ...(filters.releaseDateFrom && {
            releaseDateFrom: filters.releaseDateFrom,
          }),
          ...(filters.releaseDateTo && {
            releaseDateTo: filters.releaseDateTo,
          }),
        });

        const response = await fetch(`/api/cards?${params}`);
        const data = (await response.json()) as {
          items: Card[];
          nextCursor: string | null;
          hasMore: boolean;
        };

        if (reset) {
          setCards(data.items);
        } else {
          setCards((prev) => [...prev, ...data.items]);
        }

        setCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error("Error fetching cards:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [cursor, filters, isLoading]
  );

  // Initial load
  useEffect(() => {
    fetchCards(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle filter changes with debounce for search
  useEffect(() => {
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }

    const timeout = setTimeout(
      () => {
        setCursor(null);
        setCards([]);
        setHasMore(true);
        fetchCards(true);
      },
      filters.search ? 500 : 0
    ); // Debounce search by 500ms

    setSearchDebounce(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleLoadMore = () => {
    if (hasMore && !isLoading && cursor) {
      fetchCards(false);
    }
  };

  return (
    <div className="space-y-6">
      <CardFilters onFilterChange={setFilters} />

      <CardGrid
        cards={cards}
        selectedCards={selectedCards}
        onCardToggle={onCardToggle}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      />
    </div>
  );
}
