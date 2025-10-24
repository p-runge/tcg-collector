import { cardsTable, db } from "@/lib/db";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const cardRouter = createTRPCRouter({
  getList: publicProcedure.query(async () => {
    const cards = await db
      .select()
      .from(cardsTable)
      .orderBy(cardsTable.updated_at)
      .limit(16);
    return cards;
  }),
});
