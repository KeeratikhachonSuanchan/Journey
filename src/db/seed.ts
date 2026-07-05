import "dotenv/config";
import { config } from "dotenv";
config({ path: ".env.local", override: true });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { addDays } from "date-fns";
import { users, categories, budgets, goals, habits } from "./schema";
import { SEED_USER_ID } from "../lib/currentUser";
import { formatDate, monthStart, today } from "../lib/dates";

async function seed() {
  const client = postgres(process.env.DATABASE_URL!, { prepare: false });
  const db = drizzle(client);

  console.log("Seeding database...");

  // User
  await db
    .insert(users)
    .values({ id: SEED_USER_ID, email: "journey@example.com" })
    .onConflictDoNothing();

  // Categories
  const categoryValues = [
    { id: "c0000000-0000-0000-0000-000000000001", userId: SEED_USER_ID, name: "Rent", bucket: "needs" as const },
    { id: "c0000000-0000-0000-0000-000000000002", userId: SEED_USER_ID, name: "Groceries", bucket: "needs" as const },
    { id: "c0000000-0000-0000-0000-000000000003", userId: SEED_USER_ID, name: "Utilities", bucket: "needs" as const },
    { id: "c0000000-0000-0000-0000-000000000004", userId: SEED_USER_ID, name: "Dining Out", bucket: "wants" as const },
    { id: "c0000000-0000-0000-0000-000000000005", userId: SEED_USER_ID, name: "Entertainment", bucket: "wants" as const },
    { id: "c0000000-0000-0000-0000-000000000006", userId: SEED_USER_ID, name: "Shopping", bucket: "wants" as const },
    { id: "c0000000-0000-0000-0000-000000000007", userId: SEED_USER_ID, name: "Emergency Fund", bucket: "savings" as const },
    { id: "c0000000-0000-0000-0000-000000000008", userId: SEED_USER_ID, name: "Investments", bucket: "savings" as const },
  ];
  for (const cat of categoryValues) {
    await db.insert(categories).values(cat).onConflictDoNothing();
  }

  // Budget for current month
  const currentMonth = formatDate(monthStart(today()));
  await db
    .insert(budgets)
    .values({
      userId: SEED_USER_ID,
      month: currentMonth,
      income: "5000",
      needsRatio: 50,
      wantsRatio: 30,
      savingsRatio: 20,
    })
    .onConflictDoNothing();

  // Sample goals
  await db
    .insert(goals)
    .values([
      {
        userId: SEED_USER_ID,
        title: "Read for 30 minutes",
        domain: "dev",
        periodStart: formatDate(today()),
        periodEnd: formatDate(today()),
      },
      {
        userId: SEED_USER_ID,
        title: "Complete TypeScript course module",
        domain: "dev",
        periodStart: formatDate(today()),
        periodEnd: formatDate(addDays(today(), 7)),
      },
      {
        userId: SEED_USER_ID,
        title: "Stay within budget this month",
        domain: "finance",
        periodStart: currentMonth,
        periodEnd: formatDate(addDays(monthStart(addDays(today(), 31)), -1)),
      },
    ])
    .onConflictDoNothing();

  // Sample habits
  await db
    .insert(habits)
    .values([
      { userId: SEED_USER_ID, title: "Morning meditation", cadence: "daily" },
      { userId: SEED_USER_ID, title: "Exercise", cadence: "daily" },
      { userId: SEED_USER_ID, title: "Weekly review", cadence: "weekly" },
    ])
    .onConflictDoNothing();

  console.log("Seed complete!");
  await client.end();
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
