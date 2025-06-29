export const cardLanguages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
];

import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

const CACHE_KEYS = {
  SETS: "sets",
  CARDS: "cards",
};

export type PokemonSet = {
  id: string;
  name: string;
  series: string;
  logo: string;
  symbol: string;
  releaseDate: string;
  totalCards: number;
  variants: string[];
};

export type PokemonCard = {
  id: string;
  name: string;
  number: string;
  rarity: string;
  set: { id: string; name: string };
  images: { small: string; large: string };
  supertype: string;
  subtypes: string[];
};

class CacheManager {
  /**
   * Read a value from localStorage.
   * Returns `null` when:
   *   • running on the server
   *   • localStorage is unavailable
   *   • the key does not exist
   *   • JSON parsing fails
   */
  static get<T = unknown>(key: string): T | null {
    try {
      if (typeof window === "undefined" || !window.localStorage) return null;
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  /**
   * Safely write a value to localStorage.
   * If the browser quota is exceeded (or storage is blocked),
   * log a warning and continue without crashing the app.
   */
  static set(key: string, value: unknown): void {
    try {
      if (typeof window === "undefined" || !window.localStorage) return;
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      // Most common: QuotaExceededError (full or private-mode)
      console.warn(
        `⚠️ CacheManager: unable to save "${key}" – ${String(
          (err as Error).message
        )}`
      );
    }
  }

  /** Remove a cached item */
  static remove(key: string): void {
    try {
      if (typeof window === "undefined" || !window.localStorage) return;
      localStorage.removeItem(key);
    } catch {
      /* noop */
    }
  }

  /** Wipe all Pokémon-related cache keys */
  static clear(): void {
    try {
      if (typeof window === "undefined" || !window.localStorage) return;
      // Only clear keys we own, not the entire origin storage
      Object.values(CACHE_KEYS).forEach((k) => {
        Object.keys(localStorage)
          .filter((storedKey) => storedKey.startsWith(k))
          .forEach((matchedKey) => localStorage.removeItem(matchedKey));
      });
    } catch {
      /* noop */
    }
  }
}

export class PokemonApi {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    // The SDK’s configure helper is optional / may not exist in newer builds.
    const maybeConfigure = (PokemonTCG as unknown as { configure?: Function })
      .configure;
    const apiKey = process.env.NEXT_PUBLIC_POKEMON_TCG_API_KEY;

    if (typeof maybeConfigure === "function" && apiKey) {
      // Only call if both the function and key are available
      maybeConfigure({ apiKey });
    }

    this.initialized = true;
  }

  async getSets(): Promise<PokemonSet[]> {
    await this.initialize();

    const cachedSets = CacheManager.get(CACHE_KEYS.SETS);

    if (cachedSets) {
      console.log("Loading sets from cache");
      return cachedSets;
    }

    console.log("Fetching sets from API…");
    const sets = await PokemonTCG.getAllSets();

    const mappedSets: PokemonSet[] = sets.map((set) => ({
      id: set.id,
      name: set.name,
      series: set.series,
      logo: set.images.logo,
      symbol: set.images.symbol,
      releaseDate: set.releaseDate,
      totalCards: set.totalSetSize,
      variants: ["Normal", "Reverse Holo", "Holo"],
    }));

    CacheManager.set(CACHE_KEYS.SETS, mappedSets);
    return mappedSets;
  }

  async getCardsForSet(setId: string): Promise<PokemonCard[]> {
    await this.initialize();

    const cacheKey = `${CACHE_KEYS.CARDS}_${setId}`;
    const cached = CacheManager.get(cacheKey);
    if (cached) {
      console.log(`Loading cards for set ${setId} from cache`);
      return cached;
    }

    console.log(`Fetching cards for set ${setId} from API…`);
    try {
      // Correct helper – the SDK exposes getAllCards(options)
      const response = await PokemonTCG.getAllCards({ q: `set.id:${setId}` });

      const cards: PokemonCard[] = response.map((card) => ({
        id: card.id,
        name: card.name,
        number: card.number,
        rarity: card.rarity || "Unknown",
        set: { id: card.set.id, name: card.set.name },
        images: { small: card.images.small, large: card.images.large },
        supertype: card.supertype,
        subtypes: card.subtypes || [],
      }));

      // Sort numerically by card number
      cards.sort((a, b) => {
        const aNum = Number.parseInt(a.number.split("/")[0]) || 0;
        const bNum = Number.parseInt(b.number.split("/")[0]) || 0;
        return aNum - bNum;
      });

      CacheManager.set(cacheKey, cards);
      return cards;
    } catch (error) {
      console.error(`Error fetching cards for set ${setId}:`, error);
      return [];
    }
  }

  clearCache() {
    CacheManager.clear();
  }

  async getRarities(): Promise<string[]> {
    return ["Common", "Uncommon", "Rare", "Rare Holo", "Ultra Rare"];
  }
}

export const pokemonAPI = new PokemonApi();
