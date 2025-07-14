import { Navigation } from "@/components/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
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

      <div className="min-h-screen bg-background p-4 container mx-auto">
        {/* breadcrumb */}
        <nav className="text-sm mb-4" aria-label="Breadcrumb">
          <ol className="list-reset flex text-muted-foreground">
            <li>
              <a href="/sets" className="hover:underline">
                Sets
              </a>
            </li>
            <li className="font-semibold flex">
              <span className="mx-2">/</span>
              <Select value={selectedSet.id}>
                <SelectTrigger className="flex items-center -my-2 gap-2 p-0 border-none shadow-none bg-transparent h-auto cursor-pointer hover:underline">
                  <span className="font-bold">{selectedSet.name}</span>
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-72">
                    {sets.map((set) => (
                      <SelectItem key={set.id} value={set.id}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{set.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {set.series}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </li>
          </ol>
        </nav>
        <Content set={selectedSet} cards={cards} />
      </div>
    </TooltipProvider>
  );
}

// static parameters for the page
export async function generateStaticParams() {
  const sets = await pokemonAPI.fetchPokemonSets();
  return sets.map((set) => ({ setId: set.id }));
}
