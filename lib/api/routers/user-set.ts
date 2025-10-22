import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { userSetsTable } from "@/lib/db/index";
import { eq } from "drizzle-orm";

const userId = "a2136270-6628-418e-b9f5-8892ba5c79f2"; // TODO: Replace with actual user ID from session

export const userSetRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(userSetsTable).values({
        name: input.name,
        user_id: userId,
      });
    }),

  getList: publicProcedure.query(async ({ ctx }) => {
    const userSets = await ctx.db
      .select()
      .from(userSetsTable)
      .where(eq(userSetsTable.user_id, userId))
      .orderBy(userSetsTable.created_at);

    return userSets ?? null;
  }),

  // TODO: remove
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
