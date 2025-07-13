import { Navigation } from "@/components/navigation";
import pokemonAPI from "@/lib/pokemon-api";
import Content from "./_components/content";

export default async function SetsPage() {
  const sets = await pokemonAPI.fetchPokemonSets();

  // Group sets by series
  const setsBySeries: Record<string, typeof sets> = {};
  sets.forEach((set) => {
    if (!setsBySeries[set.series]) setsBySeries[set.series] = [];
    setsBySeries[set.series]!.push(set);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <Content sets={sets} />
    </div>
  );
}
