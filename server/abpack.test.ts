import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("abpack router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("stock operations", () => {
    it("should fetch stock items", async () => {
      const stock = await caller.abpack.getStock();
      expect(Array.isArray(stock)).toBe(true);
    });
  });

  describe("order operations", () => {
    it("should create an order", async () => {
      const result = await caller.abpack.createOrder({
        strain: "MJ1",
        strainName: "Meer Jane 1",
        categoryName: "blueten",
        packagingType: "bag",
        packages: [{ size: 1, quantity: 1, isCustom: false }],
        neededAmount: 1.3,
      });
      expect(result).toBeDefined();
    });

    it("should fetch orders", async () => {
      const orders = await caller.abpack.getOrders();
      expect(Array.isArray(orders)).toBe(true);
    });

    it("should update order status", async () => {
      const orders = await caller.abpack.getOrders();
      if (orders.length > 0) {
        const result = await caller.abpack.updateOrderStatus({
          orderId: orders[0].id,
          status: "in_bearbeitung",
        });
        expect(result).toBeDefined();
      }
    });

    it("should update order remainder", async () => {
      const orders = await caller.abpack.getOrders();
      if (orders.length > 0) {
        const result = await caller.abpack.updateOrderRemainder({
          orderId: orders[0].id,
          remainder: 0.5,
        });
        expect(result).toBeDefined();
      }
    });
  });

  describe("warehouse entry operations", () => {
    it("should create warehouse entry", async () => {
      const result = await caller.abpack.createWareneingang({
        strain: "MJ1",
        menge: 100,
        lieferant: "Blue Dream GmbH",
        chargenNr: "CH-2025-001",
        category: "blueten",
        strainName: "Meer Jane 1",
        categoryName: "blueten",
      });
      expect(result).toBeDefined();
    });

    it("should fetch warehouse entries", async () => {
      const entries = await caller.abpack.getWareneingaenge();
      expect(Array.isArray(entries)).toBe(true);
    });
  });
});
