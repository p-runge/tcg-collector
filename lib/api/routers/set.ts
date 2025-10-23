import { desc } from "drizzle-orm";
import { db, setsTable } from "@/lib/db";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const setRouter = createTRPCRouter({
  getList: publicProcedure.query(async () => {
    const sets = await db
      .select()
      .from(setsTable)
      .orderBy(desc(setsTable.releaseDate));
    return sets;
  }),
});
