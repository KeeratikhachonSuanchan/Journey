# Build Prompt — "Journey" Web App

> Paste this into a coding agent (Claude Code, Cursor, etc.). It is a complete MVP build spec. Build the MVP described below, make reasonable assumptions where details are unspecified, and list any assumptions you made at the end.

---

You are an expert full-stack engineer. Build a web application called **Journey** — a personal app for managing the things a person has to deal with when they take on a new life goal. The MVP covers two domains: **personal finance** and **self-development**.

## Core design philosophy (most important — do not violate)

Both domains are the *same loop*: **Define → Break down → Log → Review → (repeat)**. They differ only in what gets logged (money transactions vs. completed tasks/habits). **Do not build two separate apps.** Build one app where finance and self-development are specializations of one conceptual loop, so a third domain (health, reading, etc.) could be added later with minimal schema change. Keep shared UX patterns (logging, periodic review) consistent across both.

## Tech stack

- **Next.js (App Router) + TypeScript**, strict mode
- **PostgreSQL** via **Supabase** (use the Postgres DB; auth is out of scope for phase 1 — see below)
- **Drizzle ORM** with checked-in migrations and a seed script
- **Tailwind CSS + shadcn/ui** for UI
- **Recharts** for the bucket / progress charts
- Money stored as `numeric` (or integer minor units) — never floats

## Phase 1 = single user, no auth

Do **not** build authentication yet. Seed one hardcoded user and use that `user_id` everywhere. But every table must already carry `user_id` so real auth can be added later without a migration.

## Data model

Use these tables (add `created_at timestamptz default now()` to all). Use Postgres enums or check constraints for the enum columns.

**users** — `id uuid pk`, `email text`

**goals** — user-defined targets at any time horizon, set manually.
- `id uuid pk`, `user_id fk`
- `parent_id uuid nullable` (self-reference; store it, but DO NOT build roll-up logic in phase 1 — it just enables future linking of a daily goal to a monthly one)
- `title text`
- `domain enum('finance','dev')`
- `period_type enum('day','week','month','year','aspiration')`
- `period_start date` (the start of the period: Monday for week, 1st for month, Jan 1 for year; null allowed for `aspiration`)
- `status enum('open','achieved','partial','missed') default 'open'`

**habits** — recurring commitments (kept separate from one-off goals on purpose).
- `id uuid pk`, `user_id fk`, `title text`, `cadence enum('daily','weekly')`, `active boolean default true`

**reflections** — the user's manual check-in: did it succeed, and why. This is the app's differentiator.
- `id uuid pk`, `user_id fk`
- `goal_id uuid nullable fk(goals)`, `habit_id uuid nullable fk(habits)` — exactly one of the two is set (enforce with a check constraint)
- `occurred_on date` (which day/period this reflection is about)
- `outcome enum('achieved','partial','missed')`
- `reason text nullable` (free-text "why")
- `reason_tag enum('time','scope','motivation','external','other') nullable` (optional quick tag for future analysis — never required)
- `reflected_at timestamptz default now()`

**budgets** — monthly 50/30/20 setup.
- `id uuid pk`, `user_id fk`, `month date` (first of month), `income numeric`
- `needs_ratio int default 50`, `wants_ratio int default 30`, `savings_ratio int default 20`

**categories** — spending categories tagged to a bucket.
- `id uuid pk`, `user_id fk`, `name text`, `bucket enum('needs','wants','savings')`

**transactions** — finance log (kept as real columns, not JSONB, so it's indexable).
- `id uuid pk`, `user_id fk`, `category_id fk`, `amount numeric`, `occurred_on date`, `note text nullable`

**Indexes:** `goals(user_id, period_type, period_start)`, `transactions(user_id, occurred_on)`, `reflections(user_id, occurred_on)`, `categories(user_id)`.

## Features — Finance (keep simple)

- Set monthly `income` and the 50/30/20 ratios (editable).
- Manage categories, each tagged to a bucket (needs/wants/savings).
- Add transactions (amount, category, date, optional note); list the current month's transactions.
- **Bucket summary** for the selected month: sum transactions per bucket, show spent vs. target (target = ratio × income), and flag over/under for each bucket. Buckets are derived from `category.bucket` — never hardcode a bucket onto a transaction.
- **Monthly review** page: the bucket summary plus which categories consumed the most, and whether the month stayed within the 50/30/20 plan.

## Features — Self-development (keep simple)

- User creates goals at any `period_type` manually (day / week / month / year / aspiration).
- User creates recurring habits.
- A **"Today" page** that lists today's day-goals + today's habits, and lets the user review each in one place: mark `outcome` and optionally write the `reason` / pick a `reason_tag`. Creating a reflection sets the goal's `status`.
- A **weekly review** showing % of goals/habits achieved this week and the reasons given for misses.

## Explicitly OUT of scope for phase 1 (do not build)

Authentication, bank/account sync, AI-generated roadmaps, notifications/reminders, social features, multi-currency, goal roll-up/aggregation logic. Leave clean seams for these but do not implement them.

## Critical design decisions (do NOT deviate)

1. **Unmarked ≠ missed.** A goal stays `open` until the user explicitly reflects on it. There is no cron job that auto-fails unreviewed goals. `missed` only ever comes from a user reflection. This keeps motivation and data honest (can't tell "chose not to do it" from "forgot to review" otherwise).
2. **Habits (recurring) and goals (one-off, period-bound) are separate tables.** Do not merge them into one model.
3. **The reflection "why" is first-class**, not an afterthought. Always surface the reason field on every check-in. `reason_tag` is optional and never blocks submission. This is the data that makes Journey valuable later.
4. **`goals.parent_id` is stored but unused logic-wise** in phase 1 — column only, no aggregation.
5. **Prefer real columns over JSONB** for anything you query or sum (amounts, dates, category). Reserve flexible/JSON storage only for genuinely domain-varying fields, if any.
6. **Minimize data-entry friction.** The "Today" page must let the user review everything for the day in one screen — do not force them to open each goal individually.

## Build order (ship value early)

1. Drizzle schema + migrations + seed script (one user, a few categories, a sample budget).
2. **Finance loop end-to-end first** (add transaction → bucket summary → monthly review). It has deterministic math and gives the fastest visible payoff.
3. Goals + habits + the "Today" review flow + reflections.
4. Combined `/dashboard` overview (this month's buckets + active goals' progress).
5. Polish (empty states, basic charts, responsive layout).

## Pages

`/dashboard`, `/finance`, `/finance/review`, `/today`, `/goals` (list + detail with reflection history), `/goals/review`.

## Code-quality expectations

- TypeScript strict; small, composable components; shadcn/ui primitives.
- Prefer Server Components + server actions where sensible.
- One shared date utility for computing week start (Monday) and month start — used everywhere consistently.
- Drizzle migrations and a runnable `seed` script committed.
- Sensible empty/loading states.

When done, give me: how to run it locally (env vars, migrate, seed, dev), a short summary of the schema, and a list of any assumptions you made.
