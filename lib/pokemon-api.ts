import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

export type PokemonSet = {
  id: string;
  name: string;
  series: string;
  // logo: string;
  // symbol: string;
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

const rarities = Object.values(PokemonTCG.Rarity).filter(
  (value) => typeof value === "string"
) as unknown as (keyof typeof PokemonTCG.Rarity)[];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getVariants(_setId: string): string[] {
  // TODO: add map for setId to variants
  return ["Normal", "1st Edition", "Shadowless", "Reverse Holo"];
}

async function fetchPokemonSets(): Promise<PokemonSet[]> {
  return PokemonTCG.getAllSets().then((sets) =>
    sets.map(
      (set) =>
        ({
          id: set.id,
          name: set.name,
          series: set.series,
          releaseDate: set.releaseDate,
          totalCards: set.total,
          variants: getVariants(set.id),
        } satisfies PokemonSet)
    )
  );
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
  fetchPokemonSets,
  fetchPokemonCards,
  rarities,
  getVariants,
  cardLanguages,
};
export default pokemonAPI;
