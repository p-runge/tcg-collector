import { collectionsTable, db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const collection = await db
    .select()
    .from(collectionsTable)
    .where(eq(collectionsTable.id, id))
    .limit(1)
    .then((res) => res[0]);

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
