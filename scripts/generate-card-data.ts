// scripts/generate-card-data.ts
import fs from "fs";
import path from "path";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

async function main() {
  console.log("Fetching all sets...");
  const sets = await PokemonTCG.getAllSets();
  console.log(`Found ${sets.length} sets.`);
  for (const set of sets) {
    console.log(`Fetching cards for set: ${set.name} (${set.id})`);
    const cards = await PokemonTCG.getAllCards({
      q: `set.id:${set.id}`,
    });
    console.log(`Found ${cards.length} cards for set: ${set.name} (${set.id})`);
    const outPath = path.join(process.cwd(), "data/sets", `${set.id}.json`);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(cards, null, 2));
  }
}

main();
