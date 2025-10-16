import {
  cardsTable,
  collectionCardsTable,
  collectionsTable,
  db,
} from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const rows = await db
    .select({
      collection: collectionsTable,
      card: cardsTable,
    })
    .from(collectionsTable)
    .leftJoin(
      collectionCardsTable,
      eq(collectionCardsTable.collection_id, collectionsTable.id)
    )
    .leftJoin(cardsTable, eq(collectionCardsTable.card_id, cardsTable.id))
    .where(eq(collectionsTable.id, id));

  const collection = (() => {
    if (!rows || rows.length === 0) return null;
    const { collection } = rows[0]!;
    const cards = rows
      .map((r) => r.card)
      .filter(Boolean)
      .reduce((acc, card) => {
        if (!acc.find((c) => c!.id === card.id)) acc.push(card);
        return acc;
      }, [] as Array<(typeof rows)[number]["card"]>);
    return { ...collection, cards };
  })();
  console.log("Fetched collection:", collection);

  if (!collection) {
    return new Response("Collection not found", { status: 404 });
  }

  return new Response(JSON.stringify(collection), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

type UpdateCollectionRequest = {
  name: string;
};
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { name } = (await req.json()) as UpdateCollectionRequest;

  if (!name || typeof name !== "string") {
    return new Response("Invalid collection name", { status: 400 });
  }

  const result = await db
    .update(collectionsTable)
    .set({ name })
    .where(eq(collectionsTable.id, id))
    .returning()
    .then((res) => res[0]);

  if (!result) {
    return new Response("Collection not found", { status: 404 });
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
