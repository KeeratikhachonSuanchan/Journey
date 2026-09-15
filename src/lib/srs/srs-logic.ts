/**
 * Vendored as supplied by the user — do NOT edit the algorithm here.
 * All DB/timezone reconciliation lives in ./adapter.ts, which is the only
 * file in the app allowed to import from this one.
 *
 * SRS (Spaced Repetition System) Logic — Leitner Box Method
 * ------------------------------------------------------------
 * ระบบทบทวนคำศัพท์แบบเว้นระยะเวลา ยิ่งตอบถูกบ่อย ยิ่งเว้นระยะนานขึ้น
 * ตอบผิด -> รีเซ็ตกลับไปกล่องแรก ให้ทบทวนถี่ขึ้นทันที
 *
 * ใช้ร่วมกับ user-vocab.json และ common-a2-batch1.json (และชุดถัดไป)
 * โดย VocabCard คือคำศัพท์ 1 คำ, ReviewState คือสถานะการทบทวนของ "ผู้ใช้คนนั้น"
 * ต่อคำนั้น — แยกกัน เพราะคำศัพท์ชุดเดียวกันอาจถูกใช้กับหลายผู้ใช้ในอนาคต
 */

// ---------- Types ----------

export interface VocabCard {
  id: string;
  word: string;
  meaning: string;
  level: "A1" | "A2" | "B1" | "B2";
  example: string;
  source: "user" | "common";
  pos?: string;
}

export interface ReviewState {
  cardId: string;
  box: number; // 1-6, box 6 = mastered (long-term review)
  dueDate: string; // ISO date string
  lastReviewed: string | null; // ISO date string
  totalReviews: number;
  correctStreak: number;
}

export type ReviewResult = "again" | "hard" | "good" | "easy";

// ---------- Config ----------

// จำนวนวันก่อนทบทวนซ้ำ ตามกล่อง (box) ที่คำนั้นอยู่
export const BOX_INTERVALS_DAYS: Record<number, number> = {
  1: 1,   // วันถัดไป
  2: 2,
  3: 4,
  4: 7,
  5: 15,
  6: 30,  // มาสเตอร์แล้ว ทบทวนเดือนละครั้งเพื่อคงความจำ
};

const MAX_BOX = 6;
const MIN_BOX = 1;

// ---------- Core functions ----------

/** สร้างสถานะเริ่มต้นของคำศัพท์ใหม่ (ยังไม่เคยทบทวน ครบกำหนดวันนี้เลย) */
export function initReviewState(cardId: string): ReviewState {
  const today = new Date().toISOString();
  return {
    cardId,
    box: MIN_BOX,
    dueDate: today,
    lastReviewed: null,
    totalReviews: 0,
    correctStreak: 0,
  };
}

/**
 * ประมวลผลการทบทวน 1 ครั้ง แล้วคืนสถานะใหม่
 * result: "again" = ตอบผิด/จำไม่ได้เลย -> กลับไปกล่อง 1
 *         "hard"  = ตอบถูกแต่ลังเล    -> ขยับขึ้น 0 กล่อง (อยู่ที่เดิม แต่รีเฟรช due date)
 *         "good"  = ตอบถูกปกติ         -> ขยับขึ้น 1 กล่อง
 *         "easy"  = ตอบถูกไว มั่นใจ    -> ขยับขึ้น 2 กล่อง
 */
export function reviewCard(state: ReviewState, result: ReviewResult): ReviewState {
  const now = new Date();
  let newBox = state.box;
  let correctStreak = state.correctStreak;

  switch (result) {
    case "again":
      newBox = MIN_BOX;
      correctStreak = 0;
      break;
    case "hard":
      // อยู่กล่องเดิม แต่ยังนับว่าตอบถูก
      correctStreak += 1;
      break;
    case "good":
      newBox = Math.min(state.box + 1, MAX_BOX);
      correctStreak += 1;
      break;
    case "easy":
      newBox = Math.min(state.box + 2, MAX_BOX);
      correctStreak += 1;
      break;
  }

  const intervalDays = BOX_INTERVALS_DAYS[newBox] ?? BOX_INTERVALS_DAYS[MAX_BOX];
  const nextDue = new Date(now);
  nextDue.setDate(nextDue.getDate() + intervalDays);

  return {
    cardId: state.cardId,
    box: newBox,
    dueDate: nextDue.toISOString(),
    lastReviewed: now.toISOString(),
    totalReviews: state.totalReviews + 1,
    correctStreak,
  };
}

/** คืนรายการคำศัพท์ที่ "ครบกำหนดทบทวนวันนี้" จากสถานะทั้งหมดของผู้ใช้ */
export function getDueCards(states: ReviewState[], now: Date = new Date()): ReviewState[] {
  return states
    .filter((s) => new Date(s.dueDate) <= now)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

/** สรุปภาพรวมความคืบหน้า เอาไว้ทำหน้า dashboard */
export function getProgressSummary(states: ReviewState[]) {
  const total = states.length;
  const mastered = states.filter((s) => s.box === MAX_BOX).length;
  const learning = states.filter((s) => s.box > MIN_BOX && s.box < MAX_BOX).length;
  const newCards = states.filter((s) => s.box === MIN_BOX && s.totalReviews === 0).length;

  return { total, mastered, learning, newCards };
}

/**
 * ผสาน VocabCard เข้ากับ ReviewState ของผู้ใช้ — ถ้ายังไม่มีสถานะให้สร้างใหม่อัตโนมัติ
 * ใช้ตอนโหลดหน้า "ทบทวนวันนี้" ครั้งแรกของคำศัพท์ชุดใหม่ที่เพิ่งเพิ่มเข้าระบบ
 */
export function ensureReviewStates(
  cards: VocabCard[],
  existingStates: ReviewState[]
): ReviewState[] {
  const existingIds = new Set(existingStates.map((s) => s.cardId));
  const newStates = cards
    .filter((c) => !existingIds.has(c.id))
    .map((c) => initReviewState(c.id));
  return [...existingStates, ...newStates];
}

/*
 * ตัวอย่างการใช้งานใน Next.js (pseudo):
 *
 * const allCards = [...userVocab, ...commonBatch1]; // โหลดจาก JSON/DB
 * const states = ensureReviewStates(allCards, savedStatesFromDB);
 * const dueToday = getDueCards(states);
 *
 * // ผู้ใช้กดปุ่ม "Good" ตอนทบทวนคำแรกใน dueToday
 * const updated = reviewCard(dueToday[0], "good");
 * // -> บันทึก `updated` กลับลง DB แทนที่ state เดิมของ cardId นั้น
 */
