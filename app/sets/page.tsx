import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sql } from "@/lib/db";
import pokemonAPI from "@/lib/pokemon-api";
import { Heart, Star } from "lucide-react";
import Link from "next/link";

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

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Sets</h1>
          <p className="text-gray-600">
            Browse all available Pokémon card sets. Click on a set to view its
            cards or mark sets you&apos;re actively collecting.
          </p>
        </div>

        {Object.entries(setsBySeries).map(([series, seriesSets]) => (
          <div key={series} className="mb-10">
            <div className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              {series}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {seriesSets.map((set) => (
                <Card
                  key={set.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{set.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {set.series}
                        </CardDescription>
                      </div>
                      {/* // TODO: check if user is collecting set already */}
                      {true && (
                        <Badge variant="secondary" className="ml-2">
                          <Star className="w-3 h-3 mr-1" />
                          Collecting
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        {set.totalCards && `${set.totalCards} cards`}
                        {set.releaseDate &&
                          ` • Released ${new Date(
                            set.releaseDate
                          ).getFullYear()}`}
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/sets/${set.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            View Cards
                          </Button>
                        </Link>
                        <form
                          action={async () => {
                            "use server";

                            // TODO: check if user is collecting set already
                            const isCollecting = true;
                            if (isCollecting) {
                              await sql`DELETE FROM collecting_sets WHERE set_id = ${set.id}`;
                            } else {
                              await sql`
                                INSERT INTO collecting_sets (set_id)
                                VALUES (${set.id})
                                ON CONFLICT (set_id) DO NOTHING
                              `;
                            }
                          }}
                        >
                          <Button
                            type="submit"
                            variant={true ? "default" : "outline"}
                            size="icon"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                true ? "fill-current" : ""
                              }`}
                            />
                          </Button>
                        </form>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
