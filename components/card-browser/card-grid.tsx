"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Card } from "@/lib/db";
import Image from "next/image";

type CardGridProps = {
  cards: Card[];
  selectedCards: Set<string>;
  onCardToggle: (cardId: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
};

export function CardGrid({
  cards,
  selectedCards,
  onCardToggle,
  onLoadMore,
  hasMore,
  isLoading,
}: CardGridProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  if (cards.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No cards found. Try adjusting your filters.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {cards.map((card) => {
          const isSelected = selectedCards.has(card.id);
          return (
            <button
              key={card.id}
              onClick={() => onCardToggle(card.id)}
              className={cn(
                "group relative rounded-lg overflow-hidden transition-all hover:scale-105",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                isSelected && "ring-2 ring-primary"
              )}
            >
              <div className="aspect-[2.5/3.5] relative">
                <Image
                  src={card.imageSmall || "/placeholder.svg"}
                  alt={`${card.name} - ${card.number}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-primary rounded-full p-2">
                      <Check className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-xs text-white font-medium truncate">
                  {card.name}
                </p>
                <p className="text-xs text-white/70">{card.number}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Infinite scroll trigger */}
      <div
        ref={observerTarget}
        className="h-20 flex items-center justify-center"
      >
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Loading more cards...
          </div>
        )}
      </div>
    </div>
  );
}
