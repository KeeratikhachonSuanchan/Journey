// Tunable knobs for the vocabulary SRS. Kept out of actions.ts because a
// "use server" file may only export async functions (and re-exported types) —
// see src/app/english/actions.ts.

// How many brand-new cards are introduced per calendar day (Bangkok-anchored),
// on top of whatever is already due. Keeps day one of a 3,000-card bank from
// being "3,000 cards due today".
export const NEW_CARDS_PER_DAY = 15;

// Upper bound on how many cards a single review session serves, so the queue
// payload sent to the client stays small and a session is finishable on a phone.
export const SESSION_LIMIT = 40;

// Leitner box considered "mastered" — must match the last key of
// BOX_INTERVALS_DAYS in ./srs-logic.
export const MASTERED_BOX = 6;

export const BROWSE_PAGE_SIZE = 50;
