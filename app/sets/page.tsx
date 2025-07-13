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
import { Calendar, Heart, Star } from "lucide-react";
import Image from "next/image";
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

        {Object.entries(setsBySeries)
          // hide series with no sets
          .filter(([, seriesSets]) => seriesSets.length > 0)
          .map(([series, seriesSets]) => (
            <div key={series} className="mb-10">
              <div className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
                <Image
                  src={seriesSets[0]!.logo}
                  alt={`${series} logo`}
                  width={64}
                  height={64}
                  className="inline-block w-16 h-16 object-contain object-center mr-2"
                />

                <span>{series}</span>

                {/* year range */}
                <span className="text-gray-500 ml-2">
                  ({new Date(seriesSets[0]!.releaseDate).getFullYear()} -{" "}
                  {new Date(
                    seriesSets[seriesSets.length - 1]!.releaseDate
                  ).getFullYear()}
                  )
                </span>
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
                          <CardTitle className="text-lg flex items-center">
                            <Image
                              src={set.logo}
                              alt={`${set.name}`}
                              width={48}
                              height={48}
                              className="inline-block w-12 h-12 object-contain object-center mr-2"
                            />
                            <span>{set.name}</span>
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {`${new Date(set.releaseDate).getFullYear()}`}
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
                        <div className="text-sm text-gray-600 flex items-center">
                          <Image
                            src={set.symbol}
                            alt={`${set.name} symbol`}
                            width={24}
                            height={24}
                            className="inline-block w-6 h-6 object-contain object-center mr-2"
                          />
                          <span>
                            {set.totalCards && `${set.totalCards} cards`}
                          </span>
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
