import { Navigation } from "@/components/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";
import { TooltipProvider } from "@/components/ui/tooltip";
import pokemonAPI from "@/lib/pokemon-api";
import Link from "next/link";
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
              <Link href="/sets" className="hover:underline">
                Sets
              </Link>
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
                      <Link
                        key={set.id}
                        href={`/sets/${set.id}`}
                        className="flex flex-col items-start hover:bg-muted py-1 rounded"
                      >
                        <span className="font-medium">{set.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {set.series}
                        </span>
                      </Link>
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

// cache for 1 day
export const revalidate = 86400;
