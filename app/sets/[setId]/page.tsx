import { Navigation } from "@/components/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import pokemonAPI from "@/lib/pokemon-api";
import Content from "./_components/content";

export default async function SetIdPage({
  params,
}: {
  params: Promise<{ setId: string }>;
}) {
  const { setId } = await params;

  // Pokemon API data
  const sets = await pokemonAPI.fetchPokemonSets();
  const selectedSet = sets.find((s) => s.id === setId);
  if (!selectedSet) {
    throw new Error(`Set with ID ${setId} not found`);
  }

  const cards = await pokemonAPI.fetchPokemonCards(setId);

  return (
    <TooltipProvider>
      <Navigation />

      <div className="min-h-screen bg-background p-4">
        <Content sets={sets} selectedSet={selectedSet} cards={cards} />
      </div>
    </TooltipProvider>
  );
}

// static parameters for the page
export async function generateStaticParams() {
  const sets = await pokemonAPI.fetchPokemonSets();
  return sets.map((set) => ({ setId: set.id }));
}
