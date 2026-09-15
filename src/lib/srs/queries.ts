import { isNull, eq, or, type SQL } from "drizzle-orm";
import { vocabCards } from "@/db/schema";

/**
 * The one predicate for "vocab_cards this user can see": shared catalog rows
 * (user_id IS NULL) plus this user's own added words. Never filter vocab_cards
 * with a bare eq(userId) — see the CLAUDE.md note on this table.
 */
export function visibleCards(userId: string): SQL {
  return or(isNull(vocabCards.userId), eq(vocabCards.userId, userId))!;
}
