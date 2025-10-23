import { db, cardsTable } from "@/lib/db";

export async function GET() {
  const rows = await db
    .select({ card: cardsTable })
    .from(cardsTable)
    .orderBy(cardsTable.updated_at)
    .limit(100);

  // keep only card props, drop set props
  const sets = rows.map((r) => r.card);

  return new Response(
    JSON.stringify({
      items: sets,
      nextCursor: null,
      hasMore: false,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
