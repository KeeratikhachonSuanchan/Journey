# Multi-user LINE reminders — plan

Status: not started. Written 2026-07-15 as a design reference for when the app moves from single-user (phase 1) to multi-user.

## Why this isn't a schema rewrite

Every table already filters by `user_id` (see `CLAUDE.md`: "real auth can be dropped in later without a schema change"). The `reminder_time` and `qstash_schedule_id` columns added for the LINE reminder feature are already per-user rows on `users`. So the domain logic (goals/habits/reflections queries, the reminder message content) needs **no changes** — the work is entirely in three supporting pieces below.

## Piece 1: Real multi-user auth (the big one)

`src/lib/currentUser.ts` currently returns a hardcoded `SEED_USER_ID`. Replace with a real session:

- Add an auth provider — Auth.js/NextAuth or Clerk are the obvious fits for Next.js App Router.
- Add sign up / login pages.
- Change `getCurrentUserId()` to read the authenticated session instead of returning a constant.
- No other query/mutation needs to change — they already filter by `userId`.

## Piece 2: LINE has to reach one specific person, not everyone

`src/lib/line.ts`'s `broadcastLineMessages()` sends to **every** friend of the bot — fine for one user, wrong for many. Need to switch to LINE's **push API** (`/v2/bot/message/push`) with `to: <line_user_id>` targeting a specific person.

The open question: how do we know which LINE user corresponds to which app user? Two options:

### Option A — LINE's official Account Linking
- Docs: https://developers.line.biz/en/docs/messaging-api/linking-accounts/
- Uses LINE Login + a link token to securely tie a LINE friend to a web account.
- Pro: officially supported, secure, designed for exactly this.
- Con: requires creating a separate LINE Login channel, implementing the OAuth + link-token exchange flow. More setup.

### Option B — Manual linking code (simpler, good enough for small scale)
- Add a webhook endpoint (`/api/line/webhook`) that receives LINE's `follow`/`message` events, which include `event.source.userId`.
- Show a short code in the app; user pastes it into the LINE chat with the bot.
- Webhook matches the code to the logged-in app user and stores their `line_user_id`.
- Pro: no LINE Login channel needed, a few dozen lines of code.
- Con: manual copy/paste step for the user, less polished.

Either way, **one shared LINE Official Account (bot) serves all users** — nobody needs to create their own bot.

## Piece 3: Per-user QStash schedules

Already mostly ready — `reminder_time` and `qstash_schedule_id` are per-user columns. Remaining changes:

- When creating a schedule, include the `userId` in the destination URL, e.g. `.../api/cron/habit-reminder?userId=<id>`.
- Change `sendHabitReminder()` (`src/lib/habit-reminder.ts`) to take `userId` as a parameter instead of calling `getCurrentUserId()` internally.
- The route handler (`src/app/api/cron/habit-reminder/route.ts`) reads `userId` from the request and passes it through, in addition to still verifying the QStash signature.

## Suggested build order

1. **Auth** first — pieces 2 and 3 both need to know "which app user is this" before they can wire up LINE/schedules correctly.
2. **LINE linking** (pick Option A or B above).
3. **Per-user QStash** — smallest piece, do it last.

## Effort summary

| Piece | Size | Notes |
|---|---|---|
| Auth | Large | New provider, new pages, session plumbing |
| LINE linking | Medium | Option B is much smaller than Option A |
| Per-user QStash | Small | Mostly parameter-passing, schema already in place |
| Domain logic (goals/habits/reflections) | None | Already user-scoped |
