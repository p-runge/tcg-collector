// fetch sets from external API and insert into the database
import { db } from ".";
import { setsTable } from "./index";
import pokemonAPI from "../pokemon-api";

async function fetchAndStoreSets() {
  try {
    const sets = await pokemonAPI.fetchPokemonSets();

    for (const set of sets) {
      await db.insert(setsTable).values({
        id: set.id,
        name: set.name,
        logo: set.logo,
        symbol: set.symbol,
        releaseDate: set.releaseDate,
        total: set.total,
        totalWithSecretRares: set.totalWithSecretRares,
        series_id: set.series,
      });
    }

    console.log("Sets have been successfully fetched and stored.");
  } catch (error) {
    console.error("Error fetching or storing sets:", error);
  }
}

fetchAndStoreSets();
