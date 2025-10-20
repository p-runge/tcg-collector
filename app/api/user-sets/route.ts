import { db, userSetsTable, userSetCardsTable } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

type PostUserSetPayload = {
  name: string;
  cardIds: string[];
};
export async function POST(req: NextRequest) {
  const data = (await req.json()) as PostUserSetPayload;
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

  // check for existing user set with same name for this user
  const existingUserSet = await db
    .select()
    .from(userSetsTable)
    .where(
      and(eq(userSetsTable.name, name), eq(userSetsTable.user_id, userId))
    );

  if (existingUserSet.length > 0) {
    return new Response("User set with this name already exists", {
      status: 409,
    });
  }

  console.log("Creating user set", { name, userId });
  const createdUserSet = await db
    .insert(userSetsTable)
    .values({
      name,
      user_id: userId,
    })
    .returning()
    .then((res) => res[0]!);
  console.log("Created user set", createdUserSet);

  await db.insert(userSetCardsTable).values(
    data.cardIds.map((cardId) => ({
      card_id: cardId,
      user_set_id: createdUserSet.id,
    }))
  );

  return new Response("User set created", { status: 201 });
}

export async function GET() {
  const userId = "a2136270-6628-418e-b9f5-8892ba5c79f2"; // TODO: get from auth

  const userSets = await db
    .select()
    .from(userSetsTable)
    .where(eq(userSetsTable.user_id, userId))
    .orderBy(userSetsTable.created_at);

  return new Response(JSON.stringify(userSets), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
