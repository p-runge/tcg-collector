"use client";

import pokemonAPI, {
  type PokemonCard,
  type PokemonSet,
} from "@/lib/pokemon-api";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { useCallback, useEffect, useState } from "react";

export function usePokemonSets() {
  const [sets, setSets] = useState<PokemonSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stable fetch function so it can be returned as refetch
  const fetchSets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const setsData = await pokemonAPI.fetchPokemonSets();
      setSets(setsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch sets");
      console.error("Error loading sets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // run once on mount
  useEffect(() => {
    fetchSets();
  }, [fetchSets]);

  return { sets, loading, error, refetch: fetchSets };
}

export function usePokemonCards(setId: string | null) {
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!setId) {
      setCards([]);
      return;
    }

    async function fetchCards() {
      try {
        setLoading(true);
        setError(null);
        const cardsData = await PokemonTCG.findCardsByQueries({
          q: `set.id:${setId}`,
        }).then((cards) =>
          cards.map(
            (card) =>
              ({
                id: card.id,
                name: card.name,
                number: card.number,
                rarity: card.rarity,
                set: { id: card.set.id, name: card.set.name },
                images: {
                  small: card.images.small,
                  large: card.images.large,
                },
              } satisfies PokemonCard)
          )
        );
        setCards(cardsData);
      } finally {
        setLoading(false);
      }
    }

    fetchCards();
  }, [setId]);

  return { cards, loading, error };
}
