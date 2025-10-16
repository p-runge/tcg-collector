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
