import { describe, expect, it } from "vitest";
import * as db from "./db";
import { InsertStockHistory } from "../drizzle/schema";

describe("Stock History", () => {
  it("should create a stock history entry", async () => {
    const historyEntry: InsertStockHistory = {
      stockId: "TEST_STOCK",
      userId: 1,
      action: "order_created",
      previousAmount: "100.00",
      newAmount: "80.00",
      changeAmount: "-20.00",
      reason: "Order created for packaging",
      orderId: 1,
    };

    const result = await db.createStockHistory(historyEntry);
    expect(result).toBeDefined();
  });

  it("should retrieve stock history for a product", async () => {
    const history = await db.getStockHistory("TEST_STOCK");
    expect(Array.isArray(history)).toBe(true);
  });

  it("should retrieve stock history for an order", async () => {
    const history = await db.getStockHistoryForOrder(1);
    expect(Array.isArray(history)).toBe(true);
  });

  it("should track different action types", async () => {
    const actions: InsertStockHistory["action"][] = [
      "order_created",
      "order_cancelled",
      "warehouse_entry",
      "manual_adjustment",
    ];

    for (const action of actions) {
      const entry: InsertStockHistory = {
        stockId: "TEST_STOCK_ACTIONS",
        userId: 1,
        action,
        previousAmount: "100.00",
        newAmount: "90.00",
        changeAmount: "-10.00",
        reason: `Test ${action}`,
      };

      const result = await db.createStockHistory(entry);
      expect(result).toBeDefined();
    }
  });
});
