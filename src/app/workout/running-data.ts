export type RunVariant = "easy" | "tempo" | "long" | "rest" | "race";

export type RunSession = {
  variant: RunVariant;
  label: string;
  dist: string;
};

export type RunWeek = {
  week: number;
  tue: RunSession;
  fri: RunSession;
  sun: RunSession;
};

export type RunPhase = {
  num: string;
  title: string;
  note: string;
  weeks: RunWeek[];
};

export const runHeroSub =
  "แผนซ้อม 16 สัปดาห์สำหรับ John — เริ่มหลังกลับจากทะเล สิงหาคม 2026 มุ่งสู่เส้นชัย 21.1 กม. ปลายเดือนพฤศจิกายน โดยไม่ทิ้งเตะบอลวันพฤหัสและเข่าซ้ายที่ผ่าน ACL";

export const runHeroStats: { value: string; label: string; className?: string }[] = [
  { value: "16 สัปดาห์", label: "Total Weeks" },
  { value: "3 ครั้ง", label: "Runs / Week" },
  { value: "10K @ 7'/km", label: "Base Fitness" },
  {
    value: "21.1 กม. — พ.ย. 2026",
    label: "Race Goal",
    className: "text-primary",
  },
];

export const runPhases: RunPhase[] = [
  {
    num: "PHASE 01",
    title: "Base Building",
    note: "สิงหาคม — คืนฟอร์มวิ่งหลังพักยาว ให้ข้อเท้า เข่า และเอ็นชินคุ้นกับแรงกระแทกอีกครั้งก่อนเพิ่ม volume จริงจัง",
    weeks: [
      {
        week: 1,
        tue: { variant: "easy", label: "Easy", dist: "3 กม." },
        fri: { variant: "easy", label: "Easy", dist: "3 กม." },
        sun: { variant: "long", label: "Long", dist: "5 กม." },
      },
      {
        week: 2,
        tue: { variant: "easy", label: "Easy", dist: "3.5 กม." },
        fri: { variant: "easy", label: "Easy", dist: "3.5 กม." },
        sun: { variant: "long", label: "Long", dist: "6 กม." },
      },
      {
        week: 3,
        tue: { variant: "easy", label: "Easy", dist: "4 กม." },
        fri: { variant: "easy", label: "Easy", dist: "4 กม." },
        sun: { variant: "long", label: "Long", dist: "7 กม." },
      },
      {
        week: 4,
        tue: { variant: "rest", label: "Deload", dist: "3 กม." },
        fri: { variant: "rest", label: "Deload", dist: "3 กม." },
        sun: { variant: "long", label: "Long", dist: "5 กม." },
      },
    ],
  },
  {
    num: "PHASE 02",
    title: "Build Up",
    note: "กันยายน — เริ่มใส่ tempo run วันศุกร์เพื่อดัน lactate threshold ระยะ long run ขยับขึ้นเรื่อยๆ ไม่เกิน 10% ต่อสัปดาห์",
    weeks: [
      {
        week: 5,
        tue: { variant: "easy", label: "Easy", dist: "5 กม." },
        fri: { variant: "tempo", label: "Tempo", dist: "4 กม." },
        sun: { variant: "long", label: "Long", dist: "8 กม." },
      },
      {
        week: 6,
        tue: { variant: "easy", label: "Easy", dist: "5 กม." },
        fri: { variant: "tempo", label: "Tempo", dist: "4.5 กม." },
        sun: { variant: "long", label: "Long", dist: "9 กม." },
      },
      {
        week: 7,
        tue: { variant: "easy", label: "Easy", dist: "5.5 กม." },
        fri: { variant: "tempo", label: "Tempo", dist: "5 กม." },
        sun: { variant: "long", label: "Long", dist: "10 กม." },
      },
      {
        week: 8,
        tue: { variant: "rest", label: "Deload", dist: "4 กม." },
        fri: { variant: "rest", label: "Deload", dist: "4 กม." },
        sun: { variant: "long", label: "Long", dist: "7 กม." },
      },
    ],
  },
  {
    num: "PHASE 03",
    title: "Peak",
    note: "ตุลาคม — ช่วงหนักที่สุดของแผน long run แตะ 15 กม. ก่อนลดหนักลงเข้าสู่ taper ฟังเข่าซ้ายให้ดีเป็นพิเศษในช่วงนี้",
    weeks: [
      {
        week: 9,
        tue: { variant: "easy", label: "Easy", dist: "6 กม." },
        fri: { variant: "tempo", label: "Tempo", dist: "5 กม." },
        sun: { variant: "long", label: "Long", dist: "12 กม." },
      },
      {
        week: 10,
        tue: { variant: "easy", label: "Easy", dist: "6 กม." },
        fri: { variant: "tempo", label: "Tempo", dist: "5.5 กม." },
        sun: { variant: "long", label: "Long", dist: "13 กม." },
      },
      {
        week: 11,
        tue: { variant: "easy", label: "Easy", dist: "6.5 กม." },
        fri: { variant: "tempo", label: "Tempo", dist: "6 กม." },
        sun: { variant: "long", label: "Long", dist: "15 กม." },
      },
      {
        week: 12,
        tue: { variant: "rest", label: "Deload", dist: "5 กม." },
        fri: { variant: "rest", label: "Deload", dist: "4 กม." },
        sun: { variant: "long", label: "Long", dist: "10 กม." },
      },
    ],
  },
  {
    num: "PHASE 04",
    title: "Taper & Race",
    note: "พฤศจิกายน — ลดปริมาณลงเพื่อเก็บแรงไว้ให้ขา คงความคมของ pace ไว้ด้วย tempo สั้นๆ แล้วปล่อยให้ร่างกายพร้อมที่สุดในวันแข่ง",
    weeks: [
      {
        week: 13,
        tue: { variant: "easy", label: "Easy", dist: "5 กม." },
        fri: { variant: "tempo", label: "Tempo", dist: "4 กม." },
        sun: { variant: "long", label: "Long", dist: "18 กม." },
      },
      {
        week: 14,
        tue: { variant: "easy", label: "Easy", dist: "5 กม." },
        fri: { variant: "tempo", label: "Tempo", dist: "4 กม." },
        sun: { variant: "long", label: "Long", dist: "20 กม." },
      },
      {
        week: 15,
        tue: { variant: "easy", label: "Easy", dist: "4 กม." },
        fri: { variant: "rest", label: "Easy shakeout", dist: "3 กม." },
        sun: { variant: "rest", label: "Rest", dist: "—" },
      },
      {
        week: 16,
        tue: { variant: "rest", label: "Easy", dist: "3 กม." },
        fri: { variant: "rest", label: "Rest", dist: "—" },
        sun: { variant: "race", label: "Race Day", dist: "21.1 กม. 🎽" },
      },
    ],
  },
];

export const runRules: { lead: string; rest: string }[] = [
  {
    lead: "+10% only",
    rest: "เพิ่มระยะ long run ไม่เกิน 10% ต่อสัปดาห์ ไม่รีบ",
  },
  {
    lead: "Easy = คุยได้",
    rest: "ถ้าหอบจนพูดไม่ออก แปลว่าวิ่งเร็วเกินไปสำหรับวันนั้น",
  },
  {
    lead: "เข่าเจ็บ = หยุดทันที",
    rest: "ACL ซ้ายมาก่อนตัวเลขในตารางเสมอ",
  },
  {
    lead: "พฤหัสเตะบอลคงเดิม",
    rest: "ตารางวิ่งวางเลี่ยงวันเตะบอลไว้แล้ว",
  },
];

export const runLegend: { variant: RunVariant; label: string; desc: string }[] = [
  { variant: "easy", label: "Easy", desc: "pace สบาย คุยได้ตลอดทาง" },
  { variant: "tempo", label: "Tempo", desc: "เร็วกว่า easy นิดหน่อย ควบคุมจังหวะ" },
  { variant: "long", label: "Long", desc: "วิ่งยาวสร้างความอึด หัวใจของแผน" },
  { variant: "race", label: "Race", desc: "วันแข่งจริง 21.1 กม." },
];
