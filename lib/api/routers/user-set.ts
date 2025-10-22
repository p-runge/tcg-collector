import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { userSetCardsTable, userSetsTable } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const userId = "a2136270-6628-418e-b9f5-8892ba5c79f2"; // TODO: Replace with actual user ID from session

export const userSetRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string().min(1), cardIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const userSet = await ctx.db
        .insert(userSetsTable)
        .values({
          name: input.name,
          user_id: userId,
        })
        .returning()
        .then((res) => res[0]!);

      const cardValues = input.cardIds.map((cardId) => ({
        user_set_id: userSet.id,
        card_id: cardId,
      }));

      await ctx.db.insert(userSetCardsTable).values(cardValues);

      return userSet;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db
        .select({
          id: userSetsTable.id,
          name: userSetsTable.name,
          userId: userSetsTable.user_id,
        })
        .from(userSetsTable)
        .where(eq(userSetsTable.id, input.id))
        .limit(1)
        .then((res) => res[0] ?? null);

      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User set with id ${input.id} not found`,
        });
      }

      const { userId: userSetUserId, ...userSet } = data;

      if (userSetUserId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to access this user set",
        });
      }

      const userSetCards = await ctx.db
        .select({ cardId: userSetCardsTable.card_id })
        .from(userSetCardsTable)
        .where(eq(userSetCardsTable.user_set_id, input.id));

      return {
        set: userSet,
        cards: userSetCards,
      };
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1),
        cardIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(userSetsTable)
        .set({ name: input.name })
        .where(
          and(eq(userSetsTable.id, input.id), eq(userSetsTable.user_id, userId))
        )
        .returning()
        .then((res) => res[0]);

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User set with id ${input.id} not found`,
        });
      }

      if (input.cardIds) {
        await ctx.db
          .delete(userSetCardsTable)
          .where(eq(userSetCardsTable.user_set_id, input.id));

        const cardValues = input.cardIds.map((cardId) => ({
          user_set_id: input.id,
          card_id: cardId,
        }));

        await ctx.db.insert(userSetCardsTable).values(cardValues);
      }

      return result;
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
