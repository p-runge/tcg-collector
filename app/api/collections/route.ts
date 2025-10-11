import { db, userCollectionsTable } from "@/lib/db";
import { and, eq } from "drizzle-orm";

export async function POST({ formData }: Request) {
  const userId = "a2136270-6628-418e-b9f5-8892ba5c79f2"; // TODO: get from auth

  const fields = await formData();
  console.log("fields", fields);
  const name = fields.get("name");
  if (!name || typeof name !== "string" || name.length === 0) {
    return new Response("Name is required", { status: 400 });
  }

  if (name.length > 100) {
    return new Response("Name is too long", { status: 400 });
  }

  // check for existing collection with same name for this user
  await db
    .select()
    .from(userCollectionsTable)
    .where(
      and(
        eq(userCollectionsTable.name, name),
        eq(userCollectionsTable.user_id, userId)
      )
    );

  await db.insert(userCollectionsTable).values({
    name,
    user_id: userId,
  });
  return new Response("Collection created", { status: 201 });
}
