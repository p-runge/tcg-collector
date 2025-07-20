import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import TCGdex from "@tcgdex/sdk";

// Instantiate the SDK with your preferred language
const tcgdex = new TCGdex("en");

export type PokemonSet = {
  id: string;
  name: string;
  series: string;
  logo: string | null;
  symbol: string | null;
  releaseDate: string;
  total: number;
  totalWithSecretRares: number;
  variants: string[];
};

export type PokemonCard = {
  id: string;
  name: string;
  number: string;
  rarity: string;
  set: { id: string; name: string };
  images: { small: string; large: string };
  // supertype: string;
  // subtypes: string[];
};

const cardLanguages = [
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

function getCardLanguageInfo(languageCode: string) {
  return (
    cardLanguages.find((l) => l.code === languageCode) || cardLanguages[0]!
  );
}

// Card conditions with colors for quick visual identification
const conditions = [
  {
    value: "M",
    label: "Mint",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  {
    value: "NM",
    label: "Near Mint",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    value: "EX",
    label: "Excellent",
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
  {
    value: "LP",
    label: "Light Played",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  {
    value: "MP",
    label: "Moderately Played",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  {
    value: "HP",
    label: "Heavily Played",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  {
    value: "D",
    label: "Damaged",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
];

function getConditionInfo(condition: string) {
  return conditions.find((c) => c.value === condition) || conditions[1]!;
}

const rarities = Object.values(PokemonTCG.Rarity).filter(
  (value) => typeof value === "string"
) as unknown as (keyof typeof PokemonTCG.Rarity)[];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getVariants(_setId: string): string[] {
  // TODO: add map for setId to variants
  return ["Normal", "1st Edition", "Shadowless", "Reverse Holo"];
}

async function fetchPokemonSets(): Promise<PokemonSet[]> {
  return tcgdex.set.list().then(async (sets) => {
    const fullSets = await Promise.all(sets.map(async (set) => set.getSet()));

    return fullSets.map(
      (set) =>
        ({
          id: set.id,
          name: set.name,
          series: set.serie.name,
          logo: set.logo ? `${set.logo}.webp` : null,
          symbol: set.symbol ? `${set.symbol}.webp` : null,
          releaseDate: set.releaseDate,
          total: set.cardCount.official,
          totalWithSecretRares: set.cardCount.total,
          variants: getVariants(set.id),
        } satisfies PokemonSet)
    );
  });
}

async function fetchPokemonCards(setId: string): Promise<PokemonCard[]> {
  return PokemonTCG.findCardsByQueries({
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
}

const pokemonAPI = {
  cardLanguages,
  getCardLanguageInfo,
  conditions,
  getConditionInfo,
  rarities,
  getVariants,
  fetchPokemonSets,
  fetchPokemonCards,
};
export default pokemonAPI;
