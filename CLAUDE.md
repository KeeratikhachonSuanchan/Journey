# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Next.js version warning

This project runs **Next.js 16.2.9**, which post-dates most training data. `AGENTS.md` (imported above) directs you to `node_modules/next/dist/docs/` before writing routing/caching/data-fetching code — treat that as load-bearing, not optional, since App Router APIs here (e.g. `use cache`, Cache Components, `unstable_instant`) may differ from what you already "know."

## Commands

```bash
npm run dev          # dev server
npm run build         # production build
npm run lint          # eslint (flat config, eslint-config-next)
npm run db:generate    # generate a Drizzle migration from schema.ts changes
npm run db:migrate     # apply migrations (drizzle-kit migrate, uses DIRECT_URL)
npm run db:seed        # seed one hardcoded user + sample data (tsx src/db/seed.ts)
npm run db:studio      # Drizzle Studio
```

There is no test runner configured in this repo. Type-check with `tsc --noEmit` (via the `next` build) since there's no standalone `typecheck` script.

Env vars (`.env.local`): `DATABASE_URL` (pooled, used by `src/db/index.ts`) and `DIRECT_URL` (direct connection, used by `drizzle.config.ts` for migrations) — both point at the same Supabase Postgres instance.

## Architecture

**Core domain concept**: this app is one generic loop — **Define → Break down → Log → Review** — applied to two domains (finance and self-development/"dev"), not two separate apps. See `journey-build-prompt.md` for the original spec and the non-negotiable design decisions; the schema and route structure exist to keep both domains sharing the same conceptual model so a third domain could be bolted on later.

- **Goals vs. habits are intentionally separate tables** (`src/db/schema.ts`): goals are one-off and period-bound (`periodStart`/`periodEnd`, `domain: 'finance'|'dev'`), habits are recurring (`cadence`). Do not merge them.
- **Reflections are the differentiator**: a reflection (`outcome` + free-text `reason` + optional `reasonTag`) is the only thing that can set a goal's `status`. There is no scheduled job that marks goals `missed` — a goal stays `open` until the user explicitly reflects. Any new feature that touches goal status must go through a reflection, not a direct status write.
- **`reflections.goal_id`/`habit_id` is XOR-enforced** by a DB check constraint (`goal_or_habit_xor`) — exactly one is set, never both/neither.
- **`goals.parentId` is a self-reference that is stored but has no rollup/aggregation logic** — deliberately inert in the current phase (see build-prompt "Critical design decisions"). Don't add roll-up math unless explicitly asked.
- **Buckets (needs/wants/savings) live on `categories`, never on `transactions`** — bucket totals in `src/lib/finance.ts` are always derived by joining a transaction through its category. Don't add a bucket column to transactions.
- **Single-user, no auth (phase 1)**: `src/lib/currentUser.ts` returns a hardcoded `SEED_USER_ID`. Every table still carries `user_id` and every query still filters by it, so real auth can be dropped in later without a schema change — keep writing queries that filter by `getCurrentUserId()` even though today it's a constant.
- **Money is stored/passed as numeric strings**, not floats (Drizzle `numeric` columns come back as `string`); arithmetic goes through `parseFloat` at the point of use in `src/lib/finance.ts`, not earlier.
- **"Today" is anchored to Bangkok time** regardless of server timezone (`src/lib/dates.ts` `nowInBangkok()`), and `weekStart` is always Monday-based. Use the helpers in `src/lib/dates.ts` for any date/period math instead of raw `Date`/`date-fns` calls — this is the one shared date utility used across finance and goals periods.
- **Data access pattern**: each route segment owns an `actions.ts` with `"use server"` functions that both mutate (via Drizzle) and read (e.g. `getTodayData`, `getFinanceData`, `getWeeklyReview`); pages call these directly as async Server Components. Mutations end with `revalidatePath(...)` for every route that shows the changed data (check sibling actions in the same file for the full revalidate list before adding a new mutation).
- **i18n and theme are both cookie-backed, server-first**: `src/lib/i18n` (locale: `en`/`th`, dictionaries in `dictionaries.ts`) and `src/lib/theme` (light/dark) each follow the same `server.ts` (read cookie) + `context.tsx` (client provider) + `actions.ts` (server action to set cookie) split. Follow this same three-file split if adding another cookie-backed preference.
- **`src/app/workout` is a separate, mostly static personal tracker** (exercise/running plan data + tables), not part of the finance/goals domain loop — its `data.ts`/`running-data.ts` are hand-authored content, not DB-backed.
- Migrations in `drizzle/` are checked in and generated from `src/db/schema.ts` — never hand-edit a migration file; change the schema and run `db:generate`.
