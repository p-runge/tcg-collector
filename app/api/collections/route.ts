import { db, collectionsTable, collectionCardsTable } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

type PostCollectionPayload = {
  name: string;
  cardIds: string[];
};
export async function POST(req: NextRequest) {
  const data = (await req.json()) as PostCollectionPayload;
  const userId = "a2136270-6628-418e-b9f5-8892ba5c79f2"; // TODO: get from auth

  const { name } = data;
  if (!name || typeof name !== "string" || name.length === 0) {
    return new Response("Name is required", { status: 400 });
  }

  if (name.length > 100) {
    return new Response("Name is too long", { status: 400 });
  }

  if (data.cardIds.length === 0) {
    return new Response("At least one card ID is required", { status: 400 });
  }

  // check for existing collection with same name for this user
  const existingCollection = await db
    .select()
    .from(collectionsTable)
    .where(
      and(eq(collectionsTable.name, name), eq(collectionsTable.user_id, userId))
    );

  if (existingCollection.length > 0) {
    return new Response("Collection with this name already exists", {
      status: 409,
    });
  }

  console.log("Creating collection", { name, userId });
  const createdCollection = await db
    .insert(collectionsTable)
    .values({
      name,
      user_id: userId,
    })
    .returning()
    .then((res) => res[0]!);
  console.log("Created collection", createdCollection);

  await db.insert(collectionCardsTable).values(
    data.cardIds.map((cardId) => ({
      card_id: cardId,
      collection_id: createdCollection.id,
    }))
  );

  return new Response("Collection created", { status: 201 });
}

export async function GET() {
  const userId = "a2136270-6628-418e-b9f5-8892ba5c79f2"; // TODO: get from auth

  const collections = await db
    .select()
    .from(collectionsTable)
    .where(eq(collectionsTable.user_id, userId))
    .orderBy(collectionsTable.created_at);

  return new Response(JSON.stringify(collections), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
