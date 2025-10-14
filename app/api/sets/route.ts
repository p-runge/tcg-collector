import { db, setsTable } from "@/lib/db";

export async function GET() {
  const sets = await db
    .select()
    .from(setsTable)
    .orderBy(setsTable.releaseDate)
    .limit(100);

  return new Response(JSON.stringify(sets), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
