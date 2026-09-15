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
  uniqueIndex,
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

// Declaration order is significant: Postgres sorts enum columns by declaration
// order, so `orderBy(asc(vocabCards.level))` yields A1 -> A2 -> B1 -> B2 for free.
export const vocabLevelEnum = pgEnum("vocab_level", ["A1", "A2", "B1", "B2"]);
export const vocabSourceEnum = pgEnum("vocab_source", ["user", "common"]);
export const reviewResultEnum = pgEnum("review_result", [
  "again",
  "hard",
  "good",
  "easy",
]);
export const englishPhaseEnum = pgEnum("english_phase", [
  "foundation_fix",
  "listening_immersion",
  "shadowing",
  "real_conversation",
  "role_play",
  "reading_writing",
]);

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
    durationMinutes: integer("duration_minutes"),
    // 0=Sunday..6=Saturday (matches Date.getDay()); null/empty means every day.
    daysOfWeek: integer("days_of_week").array(),
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

// The vocabulary catalog. Deliberately NOT uuid-keyed: seeded rows keep the id
// from their batch file ("c0101", "u001") so re-running the importer is
// idempotent and rows stay legible in Drizzle Studio; words added from the UI
// use crypto.randomUUID() in the same text column.
//
// user_id is the one deliberate exception to "every table carries user_id and
// every query filters by it": it is NULL for shared "common" cards (a content
// catalog, not user data — see CLAUDE.md) and set for words this user added.
// Never filter this table with a bare eq(userId) — use visibleCards(userId)
// from src/lib/srs/queries.ts.
export const vocabCards = pgTable(
  "vocab_cards",
  {
    id: text("id").primaryKey(),
    userId: uuid("user_id").references(() => users.id),
    word: text("word").notNull(),
    meaning: text("meaning").notNull(),
    level: vocabLevelEnum("level").notNull(),
    example: text("example").notNull(),
    source: vocabSourceEnum("source").notNull(),
    pos: text("pos"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("vocab_cards_user_level_idx").on(table.userId, table.level),
    index("vocab_cards_word_idx").on(table.word),
    check(
      "vocab_card_source_owner",
      sql`(source = 'common' AND user_id IS NULL) OR (source = 'user' AND user_id IS NOT NULL)`
    ),
  ]
);

// One row per (user, card) the user has actually started reviewing. Rows are
// created lazily on the first answer, never eagerly for the whole catalog —
// see submitReview() in src/app/english/actions.ts.
export const vocabReviewStates = pgTable(
  "vocab_review_states",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    cardId: text("card_id")
      .notNull()
      .references(() => vocabCards.id),
    box: integer("box").default(1).notNull(),
    // Date-only and Bangkok-anchored (src/lib/dates.ts), unlike srs-logic.ts's
    // UTC ISO timestamps — see src/lib/srs/adapter.ts for the conversion.
    dueDate: date("due_date").notNull(),
    lastReviewedOn: date("last_reviewed_on"),
    // Drives the daily new-card intake cap (src/lib/srs/config.ts).
    introducedOn: date("introduced_on").notNull(),
    totalReviews: integer("total_reviews").default(0).notNull(),
    correctStreak: integer("correct_streak").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // The repo's first unique index. Load-bearing: submitReview() uses it as
    // the ON CONFLICT arbiter so a double-tap on mobile can't create two
    // states for one card (which would leave the card due twice, forever).
    uniqueIndex("vocab_review_states_user_card_idx").on(table.userId, table.cardId),
    index("vocab_review_states_user_due_idx").on(table.userId, table.dueDate),
    index("vocab_review_states_user_introduced_idx").on(table.userId, table.introducedOn),
    check("vocab_review_states_box_range", sql`box >= 1 AND box <= 6`),
  ]
);

// Append-only answer log. Powers the activity chart and the review half of the
// streak — neither is recoverable from vocab_review_states, which only keeps
// each card's latest review.
export const vocabReviewLogs = pgTable(
  "vocab_review_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    cardId: text("card_id")
      .notNull()
      .references(() => vocabCards.id),
    result: reviewResultEnum("result").notNull(),
    boxAfter: integer("box_after").notNull(),
    occurredOn: date("occurred_on").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("vocab_review_logs_user_date_idx").on(table.userId, table.occurredOn)]
);

// One row per roadmap checklist item the user ticked on a given day. The 6
// phases and their item keys are static content in
// src/app/english/roadmap-data.ts — item_key values are permanent identifiers;
// renaming one orphans its history here.
export const englishPracticeLogs = pgTable(
  "english_practice_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    phase: englishPhaseEnum("phase").notNull(),
    itemKey: text("item_key").notNull(),
    occurredOn: date("occurred_on").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("english_practice_logs_user_date_idx").on(table.userId, table.occurredOn),
    index("english_practice_logs_user_phase_idx").on(table.userId, table.phase),
  ]
);

// --- Types ---

export type User = typeof users.$inferSelect;
export type Goal = typeof goals.$inferSelect;
export type Habit = typeof habits.$inferSelect;
export type Reflection = typeof reflections.$inferSelect;
export type Budget = typeof budgets.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type VocabCard = typeof vocabCards.$inferSelect;
export type VocabReviewState = typeof vocabReviewStates.$inferSelect;
export type VocabReviewLog = typeof vocabReviewLogs.$inferSelect;
export type EnglishPracticeLog = typeof englishPracticeLogs.$inferSelect;

export type VocabLevel = (typeof vocabLevelEnum.enumValues)[number];
export type VocabSource = (typeof vocabSourceEnum.enumValues)[number];
export type ReviewResult = (typeof reviewResultEnum.enumValues)[number];
export type EnglishPhase = (typeof englishPhaseEnum.enumValues)[number];
