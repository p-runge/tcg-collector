// fetch sets from external API and insert into the database
import { cardsTable, db } from ".";
import { setsTable } from "./index";
import pokemonAPI from "../pokemon-api";

export async function fetchAndStoreSets(withCards = true) {
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

      if (withCards) await fetchAndStoreCards(set.id);
    }

    console.log("Sets have been successfully fetched and stored.");
  } catch (error) {
    console.error("Error fetching or storing sets:", error);
  }
}

export async function fetchAndStoreCards(setId: string) {
  console.log("Fetching and storing cards...");
  try {
    const cards = await pokemonAPI.fetchPokemonCards(setId);
    console.log(`Fetched ${cards.length} cards from the API.`);
    console.log("cards", cards);

    for (const card of cards) {
      console.log(`Storing card: ${card.name} (${card.id})`, card);
      await db
        .insert(cardsTable)
        .values({
          id: card.id,
          name: card.name,
          number: card.number,
          rarity: card.rarity,
          imageSmall: card.images.small,
          imageLarge: card.images.large,
          setId: card.set.id,
        })
        .onConflictDoUpdate({
          target: cardsTable.id,
          set: {
            name: card.name,
            number: card.number,
            rarity: card.rarity,
            imageSmall: card.images.small,
            imageLarge: card.images.large,
            setId: card.set.id,
          },
        });
      console.log(`Stored card: ${card.name} (${card.id})`);
    }

    console.log("Cards have been successfully fetched and stored.");
  } catch (error) {
    console.error("Error fetching or storing cards:", error);
  }
}
