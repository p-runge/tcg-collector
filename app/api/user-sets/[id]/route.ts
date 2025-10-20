import { cardsTable, userSetCardsTable, userSetsTable, db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const rows = await db
    .select({
      userSet: userSetsTable,
      card: cardsTable,
    })
    .from(userSetsTable)
    .leftJoin(
      userSetCardsTable,
      eq(userSetCardsTable.user_set_id, userSetsTable.id)
    )
    .leftJoin(cardsTable, eq(userSetCardsTable.card_id, cardsTable.id))
    .where(eq(userSetsTable.id, id));

  const userSet = (() => {
    if (!rows || rows.length === 0) return null;
    const { userSet } = rows[0]!;
    const cards = rows
      .map((r) => r.card)
      .filter(Boolean)
      .reduce((acc, card) => {
        if (!acc.find((c) => c!.id === card.id)) acc.push(card);
        return acc;
      }, [] as Array<(typeof rows)[number]["card"]>);
    return { ...userSet, cards };
  })();
  console.log("Fetched user set:", userSet);

  if (!userSet) {
    return new Response("User set not found", { status: 404 });
  }

  return new Response(JSON.stringify(userSet), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

type UpdateUserSetRequest = {
  name: string;
};
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name } = (await req.json()) as UpdateUserSetRequest;

  if (!name || typeof name !== "string") {
    return new Response("Invalid user set name", { status: 400 });
  }

  const result = await db
    .update(userSetsTable)
    .set({ name })
    .where(eq(userSetsTable.id, id))
    .returning()
    .then((res) => res[0]);

  if (!result) {
    return new Response("User set not found", { status: 404 });
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
