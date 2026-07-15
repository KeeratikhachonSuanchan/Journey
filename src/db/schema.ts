import {
  pgTable,
  uuid,
  text,
  date,
  numeric,
  integer,
  boolean,
  timestamp,
  pgEnum,
  index,
  check,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// --- Enums ---

export const domainEnum = pgEnum("domain", ["finance", "dev"]);
export const goalStatusEnum = pgEnum("goal_status", [
  "open",
  "achieved",
  "partial",
  "missed",
]);
export const cadenceEnum = pgEnum("cadence", [
  "daily",
  "weekly",
  "monthly",
  "quarterly",
]);
export const outcomeEnum = pgEnum("outcome", ["achieved", "partial", "missed"]);
export const reasonTagEnum = pgEnum("reason_tag", [
  "time",
  "scope",
  "motivation",
  "external",
  "other",
]);
export const bucketEnum = pgEnum("bucket", ["needs", "wants", "savings"]);

// --- Tables ---

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  reminderTime: text("reminder_time"),
  qstashScheduleId: text("qstash_schedule_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const goals = pgTable(
  "goals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    parentId: uuid("parent_id").references((): AnyPgColumn => goals.id),
    title: text("title").notNull(),
    domain: domainEnum("domain").notNull(),
    periodStart: date("period_start"),
    periodEnd: date("period_end"),
    status: goalStatusEnum("status").default("open").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("goals_user_period_idx").on(
      table.userId,
      table.periodStart,
      table.periodEnd
    ),
    index("goals_parent_idx").on(table.parentId),
  ]
);

export const habits = pgTable(
  "habits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    goalId: uuid("goal_id").references(() => goals.id),
    title: text("title").notNull(),
    cadence: cadenceEnum("cadence").notNull(),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("habits_goal_idx").on(table.goalId)]
);

export const reflections = pgTable(
  "reflections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    goalId: uuid("goal_id").references(() => goals.id),
    habitId: uuid("habit_id").references(() => habits.id),
    occurredOn: date("occurred_on").notNull(),
    outcome: outcomeEnum("outcome").notNull(),
    reason: text("reason"),
    reasonTag: reasonTagEnum("reason_tag"),
    reflectedAt: timestamp("reflected_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("reflections_user_date_idx").on(table.userId, table.occurredOn),
    check(
      "goal_or_habit_xor",
      sql`(goal_id IS NOT NULL AND habit_id IS NULL) OR (goal_id IS NULL AND habit_id IS NOT NULL)`
    ),
  ]
);

export const budgets = pgTable("budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  month: date("month").notNull(),
  income: numeric("income").notNull(),
  needsRatio: integer("needs_ratio").default(50).notNull(),
  wantsRatio: integer("wants_ratio").default(30).notNull(),
  savingsRatio: integer("savings_ratio").default(20).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    name: text("name").notNull(),
    bucket: bucketEnum("bucket").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("categories_user_idx").on(table.userId)]
);

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id),
    amount: numeric("amount").notNull(),
    occurredOn: date("occurred_on").notNull(),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("transactions_user_date_idx").on(table.userId, table.occurredOn)]
);

// --- Types ---

export type User = typeof users.$inferSelect;
export type Goal = typeof goals.$inferSelect;
export type Habit = typeof habits.$inferSelect;
export type Reflection = typeof reflections.$inferSelect;
export type Budget = typeof budgets.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
