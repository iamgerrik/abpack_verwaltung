import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  abpack: router({
    // Stock queries
    getStock: protectedProcedure.query(() => db.getStock()),
    
    updateStockMenge: protectedProcedure
      .input(z.object({
        stockId: z.string(),
        newMenge: z.number(),
        newHersteller: z.string().optional(),
      }))
      .mutation(({ input }) => db.updateStockMenge(input.stockId, input.newMenge, input.newHersteller)),
    
    createStock: protectedProcedure
      .input(z.object({
        id: z.string(),
        category: z.string(),
        name: z.string(),
        hersteller: z.string().optional(),
        menge: z.number().optional(),
      }))
      .mutation(({ input }) => db.createStock(input)),
    
    updateStock: protectedProcedure
      .input(z.object({
        stockId: z.string(),
        name: z.string().optional(),
        category: z.string().optional(),
        hersteller: z.string().optional(),
      }))
      .mutation(({ input }) => db.updateStock(input.stockId, {
        name: input.name,
        category: input.category,
        hersteller: input.hersteller,
      })),
    
    deleteStock: protectedProcedure
      .input(z.object({ stockId: z.string() }))
      .mutation(({ input }) => db.deleteStock(input.stockId)),
    
    // Orders
    createOrder: protectedProcedure
      .input(z.object({
        strain: z.string(),
        strainName: z.string(),
        categoryName: z.string(),
        packagingType: z.string(),
        packages: z.any(),
        neededAmount: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const order = await db.createOrder({
          userId: ctx.user.id,
          strain: input.strain,
          strainName: input.strainName,
          categoryName: input.categoryName,
          packagingType: input.packagingType,
          packages: input.packages,
          neededAmount: input.neededAmount.toString(),
          status: "offen",
        });
        return order;
      }),
    
    getOrders: protectedProcedure.query(() => db.getOrders()),
    
    updateOrderStatus: protectedProcedure
      .input(z.object({
        orderId: z.number(),
        status: z.string(),
      }))
      .mutation(({ ctx, input }) => {
        // When status changes to 'in_bearbeitung', record who started processing
        const processedByUserId = input.status === 'in_bearbeitung' ? ctx.user.id : undefined;
        return db.updateOrderStatus(input.orderId, input.status, processedByUserId);
      }),
    
    updateOrderRemainder: protectedProcedure
      .input(z.object({
        orderId: z.number(),
        remainder: z.number(),
      }))
      .mutation(({ input }) => db.updateOrderRemainder(input.orderId, input.remainder)),
    
    deleteOrder: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .mutation(({ input }) => db.deleteOrder(input.orderId)),
    
    // Warehouse entries
    createWareneingang: protectedProcedure
      .input(z.object({
        strain: z.string(),
        menge: z.number(),
        lieferant: z.string().optional(),
        chargenNr: z.string().optional(),
        category: z.string(),
        strainName: z.string(),
        categoryName: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const entry = await db.createWareneingang({
          userId: ctx.user.id,
          strain: input.strain,
          menge: input.menge.toString(),
          lieferant: input.lieferant,
          chargenNr: input.chargenNr,
          category: input.category,
          strainName: input.strainName,
          categoryName: input.categoryName,
        });
        return entry;
      }),
    
    getWareneingaenge: protectedProcedure.query(() => db.getWareneingaenge()),
    
    // Stock history
    getStockHistory: protectedProcedure
      .input(z.object({ stockId: z.string() }))
      .query(({ input }) => db.getStockHistory(input.stockId)),
    
    getStockHistoryForOrder: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(({ input }) => db.getStockHistoryForOrder(input.orderId)),
  }),
});

export type AppRouter = typeof appRouter;
