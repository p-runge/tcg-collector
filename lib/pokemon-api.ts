import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

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

export const RARITIES = Object.values(PokemonTCG.Rarity).filter(
  (value) => typeof value === "string"
) as unknown as (keyof typeof PokemonTCG.Rarity)[];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getVariants(_setId: string): string[] {
  // TODO: add map for setId to variants
  return ["Normal", "1st Edition", "Shadowless", "Reverse Holo"];
}
