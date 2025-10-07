// fetch sets from external API and insert into the database
import { db } from ".";
import { setsTable } from "./index";
import pokemonAPI from "../pokemon-api";

export async function fetchAndStoreSets() {
  console.log("Fetching and storing sets...");
  try {
    const sets = await pokemonAPI.fetchPokemonSets();
    console.log(`Fetched ${sets.length} sets from the API.`);

    for (const set of sets) {
      console.log(`Storing set: ${set.name} (${set.id})`, set);
      await db
        .insert(setsTable)
        .values({
          id: set.id,
          name: set.name,
          logo: set.logo,
          symbol: set.symbol,
          releaseDate: set.releaseDate,
          total: set.total,
          totalWithSecretRares: set.totalWithSecretRares,
          series: set.series,
        })
        .onConflictDoUpdate({
          target: setsTable.id,
          set: {
            updated_at: new Date().toISOString(),
            name: set.name,
            logo: set.logo,
            symbol: set.symbol,
            releaseDate: set.releaseDate,
            total: set.total,
            totalWithSecretRares: set.totalWithSecretRares,
            series: set.series,
          },
        });
      console.log(`Stored set: ${set.name} (${set.id})`);
    }

    console.log("Sets have been successfully fetched and stored.");
  } catch (error) {
    console.error("Error fetching or storing sets:", error);
  }
}

fetchAndStoreSets();
