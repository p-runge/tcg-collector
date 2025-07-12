"use client";

import { useState, useEffect, useCallback } from "react";
import {
  pokemonAPI,
  type PokemonSet,
  type PokemonCard,
} from "@/lib/pokemon-api";

export function usePokemonSets() {
  const [sets, setSets] = useState<PokemonSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stable fetch function so it can be returned as refetch
  const fetchSets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const setsData = await pokemonAPI.getAllSets().then((sets) =>
        sets.map((set) => ({
          id: set.id,
          name: set.name,
          totalCards: set.total,
          releaseDate: set.releaseDate,
          series: set.series,
        }))
      );
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
        const cardsData = await pokemonAPI.getCardsForSet(setId);
        setCards(cardsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch cards");
        console.error("Error loading cards:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCards();
  }, [setId]);

  return { cards, loading, error };
}

export function usePokemonRarities() {
  const [rarities, setRarities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRarities() {
      try {
        setLoading(true);
        setError(null);
        const raritiesData = await pokemonAPI.getRarities();
        setRarities(raritiesData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch rarities"
        );
        console.error("Error loading rarities:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRarities();
  }, []);

  return { rarities, loading, error };
}
