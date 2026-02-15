import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Stock items table
export const stock = mysqlTable("stock", {
  id: varchar("id", { length: 64 }).primaryKey(),
  category: varchar("category", { length: 64 }).notNull(),
  name: text("name").notNull(),
  hersteller: text("hersteller"),
  menge: decimal("menge", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Stock = typeof stock.$inferSelect;
export type InsertStock = typeof stock.$inferInsert;

// Orders table
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  processedByUserId: int("processedByUserId"),
  strain: varchar("strain", { length: 64 }).notNull(),
  strainName: text("strainName").notNull(),
  categoryName: varchar("categoryName", { length: 64 }).notNull(),
  packagingType: varchar("packagingType", { length: 20 }).notNull(),
  packages: json("packages").notNull(),
  neededAmount: decimal("neededAmount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["offen", "in_bearbeitung", "fertig"]).default("offen").notNull(),
  remainder: decimal("remainder", { precision: 10, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// Warehouse entries table
export const wareneingaenge = mysqlTable("wareneingaenge", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  strain: varchar("strain", { length: 64 }).notNull(),
  menge: decimal("menge", { precision: 10, scale: 2 }).notNull(),
  lieferant: text("lieferant"),
  chargenNr: varchar("chargenNr", { length: 100 }),
  category: varchar("category", { length: 64 }).notNull(),
  strainName: text("strainName").notNull(),
  categoryName: varchar("categoryName", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Wareneingang = typeof wareneingaenge.$inferSelect;
export type InsertWareneingang = typeof wareneingaenge.$inferInsert;

// Stock history audit table
export const stockHistory = mysqlTable("stockHistory", {
  id: int("id").autoincrement().primaryKey(),
  stockId: varchar("stockId", { length: 64 }).notNull(),
  userId: int("userId").notNull(),
  action: mysqlEnum("action", ["order_created", "order_cancelled", "warehouse_entry", "manual_adjustment"]).notNull(),
  previousAmount: decimal("previousAmount", { precision: 10, scale: 2 }).notNull(),
  newAmount: decimal("newAmount", { precision: 10, scale: 2 }).notNull(),
  changeAmount: decimal("changeAmount", { precision: 10, scale: 2 }).notNull(),
  reason: text("reason"),
  orderId: int("orderId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StockHistory = typeof stockHistory.$inferSelect;
export type InsertStockHistory = typeof stockHistory.$inferInsert;