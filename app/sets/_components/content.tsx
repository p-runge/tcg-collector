"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PokemonSet } from "@/lib/pokemon-api";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Props = {
  sets: PokemonSet[];
};
export default function Content({ sets }: Props) {
  const [search, setSearch] = useState("");

  const filteredSets = sets.filter((set) =>
    set.name.toLowerCase().includes(search.toLowerCase())
  );

  // Group sets by series
  const setsBySeries: Record<string, typeof sets> = {};
  filteredSets.forEach((set) => {
    if (!setsBySeries[set.series]) setsBySeries[set.series] = [];
    setsBySeries[set.series]!.push(set);
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Sets</h1>
        <p className="text-muted-foreground">
          Browse all available Pokémon card sets. Click on a set to view its
          cards or mark sets you&apos;re actively collecting.
        </p>

        {/* --- Search Bar --- */}
        <input
          type="text"
          placeholder="Search set names..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-4 w-full max-w-md px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring"
        />
      </div>

      {Object.entries(setsBySeries)
        // hide series with no sets
        .filter(([, seriesSets]) => seriesSets.length > 0)
        .map(([series, seriesSets]) => (
          <div key={series} className="mb-10">
            <div className="text-xl font-semibold mb-4 border-b pb-2 flex items-center">
              {seriesSets[0]!.logo && (
                <Image
                  src={seriesSets[0]!.logo}
                  alt={`${series} logo`}
                  width={64}
                  height={64}
                  className="inline-block w-16 h-16 object-contain object-center mr-2"
                />
              )}

              <span>{series}</span>

              {/* year range */}
              <span className="text-muted-foreground ml-2">
                ({new Date(seriesSets[0]!.releaseDate).getFullYear()} -{" "}
                {new Date(
                  seriesSets[seriesSets.length - 1]!.releaseDate
                ).getFullYear()}
                )
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {seriesSets.map((set) => (
                <Link href={`/sets/${set.id}`} key={set.id}>
                  <Card
                    className="hover:shadow-lg transition-shadow h-full flex flex-col justify-between"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center">
                            {set.logo && (
                              <Image
                                src={set.logo}
                                alt={`${set.name}`}
                                width={48}
                                height={48}
                                className="inline-block w-12 h-12 object-contain object-center mr-2"
                              />
                            )}
                            <span>{set.name}</span>
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {`${new Date(set.releaseDate).getFullYear()}`}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-sm flex items-center">
                          {set.symbol && (
                            <Image
                              src={set.symbol}
                              alt={`${set.name} symbol`}
                              width={24}
                              height={24}
                              className="inline-block w-6 h-6 object-contain object-center mr-2"
                            />
                          )}
                          <span>
                            {set.total &&
                              `${set.total}${set.totalWithSecretRares > set.total
                                ? ` (+${set.totalWithSecretRares - set.total})`
                                : ""
                              } cards`}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
    </main>
  );
}
