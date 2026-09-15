import type { EnglishPhase } from "@/db/schema";

// The 6 phases from the original spec ("Learning Roadmap"), translated to
// {en, th} pairs so the section works with the site's existing locale toggle.
// `item_key` values are PERMANENT identifiers used as the key in
// english_practice_logs — renaming one orphans that row's history. Add new
// items with new keys instead of renaming; retire old ones by leaving them
// out of the UI rather than deleting the key.

export type Localized = { en: string; th: string };
export type RoadmapItem = { key: string; label: Localized };
export type RoadmapPhase = {
  key: EnglishPhase;
  order: number;
  title: Localized;
  duration: Localized;
  description: Localized;
  items: RoadmapItem[];
};

export function pick(v: Localized, locale: "en" | "th"): string {
  return v[locale];
}

export const roadmapPhases: RoadmapPhase[] = [
  {
    key: "foundation_fix",
    order: 1,
    title: { en: "Foundation Fix", th: "ปูพื้นฐานให้แน่น" },
    duration: { en: "2-3 weeks", th: "2-3 สัปดาห์" },
    description: {
      en: "Fix core grammar — past tense, present perfect, subject-verb agreement — by speaking sentences about your own life for 10-15 minutes a day.",
      th: "แก้ grammar หลัก: past tense, present perfect, subject-verb agreement ผ่านการพูดประโยคเกี่ยวกับชีวิตตัวเอง 10-15 นาที/วัน",
    },
    items: [
      {
        key: "speak_10min",
        label: {
          en: "Speak about your day for 10-15 minutes",
          th: "พูดเกี่ยวกับชีวิตประจำวัน 10-15 นาที",
        },
      },
      {
        key: "past_tense_drill",
        label: { en: "Practice past tense sentences", th: "ฝึกประโยค past tense" },
      },
      {
        key: "present_perfect_drill",
        label: { en: "Practice present perfect sentences", th: "ฝึกประโยค present perfect" },
      },
    ],
  },
  {
    key: "listening_immersion",
    order: 2,
    title: { en: "Listening Immersion", th: "ฟังแบบต่อเนื่อง" },
    duration: { en: "Ongoing", th: "ต่อเนื่อง" },
    description: {
      en: "Listen to A2-B1 podcasts or YouTube on work/travel/sport topics for 15-20 minutes a day.",
      th: "ฟัง podcast/YouTube ระดับ A2-B1 หัวข้อ work/travel/sport 15-20 นาที/วัน",
    },
    items: [
      {
        key: "listen_15min",
        label: { en: "Listen for 15-20 minutes", th: "ฟัง 15-20 นาที" },
      },
      {
        key: "note_new_word",
        label: {
          en: "Note down one new word you heard",
          th: "จดคำศัพท์ใหม่ที่ได้ยิน 1 คำ",
        },
      },
    ],
  },
  {
    key: "shadowing",
    order: 3,
    title: { en: "Speaking Practice — Shadowing", th: "ฝึกพูดแบบ Shadowing" },
    duration: { en: "Ongoing", th: "ต่อเนื่อง" },
    description: {
      en: "Repeat immediately after the audio from a 1-2 minute clip to build natural rhythm and pronunciation.",
      th: "พูดตามเสียงทันที จากคลิป 1-2 นาที",
    },
    items: [
      {
        key: "shadow_one_clip",
        label: { en: "Shadow one 1-2 minute clip", th: "Shadowing คลิป 1-2 นาที 1 คลิป" },
      },
      {
        key: "record_and_compare",
        label: {
          en: "Record yourself and compare to the original",
          th: "อัดเสียงตัวเองแล้วเทียบกับต้นฉบับ",
        },
      },
    ],
  },
  {
    key: "real_conversation",
    order: 4,
    title: { en: "Real Conversation Practice", th: "ฝึกสนทนาจริง" },
    duration: { en: "2x per week", th: "2 ครั้ง/สัปดาห์" },
    description: {
      en: "Talk with a speaking partner (iTalki, Cambly, Tandem) twice a week.",
      th: "คุยกับ speaking partner (iTalki/Cambly/Tandem) 2 ครั้ง/สัปดาห์",
    },
    items: [
      {
        key: "book_session",
        label: { en: "Book or have a conversation session", th: "นัดหรือคุยกับ speaking partner" },
      },
      {
        key: "review_mistakes",
        label: {
          en: "Review mistakes from the last session",
          th: "ทบทวนข้อผิดพลาดจากครั้งก่อน",
        },
      },
    ],
  },
  {
    key: "role_play",
    order: 5,
    title: { en: "Situational Role-play", th: "จำลองสถานการณ์จริง" },
    duration: { en: "Ongoing", th: "ต่อเนื่อง" },
    description: {
      en: "Simulate real situations: job interviews, talking with foreign colleagues, booking accommodation or opening a bank account in NZ.",
      th: "จำลองสถานการณ์จริง: สัมภาษณ์งาน, คุยเพื่อนร่วมงานต่างชาติ, จองที่พัก/เปิดบัญชีที่ NZ",
    },
    items: [
      {
        key: "practice_scenario",
        label: {
          en: "Practice one real-life scenario out loud",
          th: "ฝึกพูดสถานการณ์จำลอง 1 สถานการณ์",
        },
      },
      {
        key: "use_new_vocab",
        label: {
          en: "Use 3 new words from the vocab deck in a sentence",
          th: "ใช้คำศัพท์ใหม่จากคลังคำศัพท์ 3 คำในประโยค",
        },
      },
    ],
  },
  {
    key: "reading_writing",
    order: 6,
    title: { en: "Light Reading/Writing Support", th: "อ่านเขียนเสริม" },
    duration: { en: "Ongoing", th: "ต่อเนื่อง" },
    description: {
      en: "Write a short 3-4 sentence journal entry daily, and read short articles to collect new vocabulary.",
      th: "journal สั้น 3-4 ประโยค/วัน, อ่านบทความสั้นเก็บคำศัพท์",
    },
    items: [
      {
        key: "journal_entry",
        label: { en: "Write a 3-4 sentence journal entry", th: "เขียน journal สั้น 3-4 ประโยค" },
      },
      {
        key: "read_short_article",
        label: { en: "Read one short article", th: "อ่านบทความสั้น 1 บทความ" },
      },
    ],
  },
];
