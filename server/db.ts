import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { users, stock, orders, wareneingaenge, stockHistory, InsertStock, InsertOrder, InsertWareneingang, InsertStockHistory } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateLastSignedIn(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, userId));
}

export async function createUser(user: { username: string; password: string; name?: string; role?: "user" | "admin" }) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(users).values({
    username: user.username,
    password: user.password,
    name: user.name || user.username,
    role: user.role || "user",
  });
  
  return result;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select({
    id: users.id,
    username: users.username,
    name: users.name,
    role: users.role,
    createdAt: users.createdAt,
    lastSignedIn: users.lastSignedIn,
  }).from(users);
}

export async function getStock() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(stock);
}

export async function updateStockMenge(stockId: string, newMenge: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.update(stock).set({ menge: newMenge.toString() }).where(eq(stock.id, stockId));
  return result;
}

export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) return null;
  return await db.insert(orders).values(order);
}

export async function getOrders() {
  const db = await getDb();
  if (!db) return [];
  
  // Get orders with creator and processor names
  const result = await db
    .select({
      id: orders.id,
      userId: orders.userId,
      processedByUserId: orders.processedByUserId,
      strain: orders.strain,
      strainName: orders.strainName,
      categoryName: orders.categoryName,
      packagingType: orders.packagingType,
      packages: orders.packages,
      neededAmount: orders.neededAmount,
      status: orders.status,
      remainder: orders.remainder,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders)
    .orderBy(desc(orders.createdAt));
  
  // Get user names for creator and processor
  const userIds = [...new Set(result.flatMap(o => [o.userId, o.processedByUserId].filter(Boolean)))];
  const userMap = new Map<number, string>();
  
  if (userIds.length > 0) {
    const usersList = await db.select({ id: users.id, name: users.name }).from(users);
    usersList.forEach(u => userMap.set(u.id, u.name || 'Unbekannt'));
  }
  
  return result.map(o => ({
    ...o,
    createdByName: userMap.get(o.userId) || 'Unbekannt',
    processedByName: o.processedByUserId ? userMap.get(o.processedByUserId) || 'Unbekannt' : null,
  }));
}

export async function updateOrderStatus(orderId: number, status: string, processedByUserId?: number) {
  const db = await getDb();
  if (!db) return null;
  const updateData: { status: any; processedByUserId?: number } = { status: status as any };
  if (processedByUserId !== undefined) {
    updateData.processedByUserId = processedByUserId;
  }
  return await db.update(orders).set(updateData).where(eq(orders.id, orderId));
}

export async function updateOrderRemainder(orderId: number, remainder: number) {
  const db = await getDb();
  if (!db) return null;
  return await db.update(orders).set({ remainder: remainder.toString() }).where(eq(orders.id, orderId));
}

export async function deleteOrder(orderId: number) {
  const db = await getDb();
  if (!db) return null;
  return await db.delete(orders).where(eq(orders.id, orderId));
}

export async function createWareneingang(entry: InsertWareneingang) {
  const db = await getDb();
  if (!db) return null;
  return await db.insert(wareneingaenge).values(entry);
}

export async function getWareneingaenge() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(wareneingaenge).orderBy(desc(wareneingaenge.createdAt));
}

export async function createStockHistory(entry: InsertStockHistory) {
  const db = await getDb();
  if (!db) return null;
  return await db.insert(stockHistory).values(entry);
}

export async function getStockHistory(stockId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(stockHistory).where(eq(stockHistory.stockId, stockId)).orderBy(desc(stockHistory.createdAt));
}

export async function getStockHistoryForOrder(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(stockHistory).where(eq(stockHistory.orderId, orderId)).orderBy(desc(stockHistory.createdAt));
}
