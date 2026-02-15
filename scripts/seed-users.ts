/// <reference types="node" />
/**
 * Seed script to create initial users with bcrypt hashed passwords
 * Run with: npx tsx scripts/seed-users.ts
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/mysql2";
import { users } from "../drizzle/schema";

const SALT_ROUNDS = 10;

// Initial users - CHANGE PASSWORDS IN PRODUCTION!
const initialUsers = [
  // Mitarbeiter (user)
  { username: "gio", password: "gio123", name: "Gio", role: "user" as const },
  { username: "claudio", password: "claudio123", name: "Claudio", role: "user" as const },
  { username: "gerrik", password: "gerrik123", name: "Gerrik", role: "user" as const },
  { username: "martin", password: "martin123", name: "Martin", role: "user" as const },
  // Admin (Geschäftsleitung)
  { username: "cristian", password: "cristian123", name: "Cristian", role: "admin" as const },
  { username: "debby", password: "debby123", name: "Debby", role: "admin" as const },
];

async function seedUsers() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not set");
    process.exit(1);
  }

  const db = drizzle(process.env.DATABASE_URL);

  console.log("🌱 Seeding users...\n");

  for (const user of initialUsers) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
      
      await db.insert(users).values({
        username: user.username,
        password: hashedPassword,
        name: user.name,
        role: user.role,
      }).onDuplicateKeyUpdate({
        set: {
          password: hashedPassword,
          name: user.name,
          role: user.role,
        },
      });
      
      console.log(`✅ ${user.username} (${user.role})`);
    } catch (error) {
      console.error(`❌ Failed to create ${user.username}:`, error);
    }
  }

  console.log("\n✨ User seeding complete!");
  console.log("\n⚠️  Remember to change default passwords in production!");
  process.exit(0);
}

seedUsers().catch(console.error);
