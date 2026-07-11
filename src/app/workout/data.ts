export type DayColor = "blue" | "orange" | "violet" | "amber" | "emerald";

export type ExerciseTag = "cable" | "acl";

export type Exercise = {
  name: string;
  sets: string;
  note: string;
  videoUrl?: string;
  tags?: ExerciseTag[];
};

export type SessionRow = {
  label: string;
  duration: string;
  note: string;
};

export type DualModeDay = {
  kind: "dual";
  key: string;
  weekday: string;
  dayType: string;
  badge: string;
  color: DayColor;
  title: string;
  subtitle: string;
  aclAware?: boolean;
  gym: Exercise[];
  home: Exercise[];
};

export type SingleModeDay = {
  kind: "single";
  key: string;
  weekday: string;
  dayType: string;
  badge: string;
  color: DayColor;
  title: string;
  subtitle: string;
  columns: [string, string, string];
  rows: SessionRow[];
  tip?: string;
};

export type RestDay = {
  kind: "rest";
  weekday: string;
};

export type DayPlan = DualModeDay | SingleModeDay | RestDay;

export const weekPlan: DayPlan[] = [
  {
    kind: "dual",
    key: "push",
    weekday: "จันทร์",
    dayType: "Upper A",
    badge: "Push",
    color: "blue",
    title: "วันจันทร์ — Upper A (Push)",
    subtitle: "อก / ไหล่ / ไทรเซป · 30-35 นาที",
    gym: [
      {
        name: "Dumbbell Bench Press",
        sets: "3 × 12",
        videoUrl: "https://www.youtube.com/watch?v=4Y2ZdHCOXok",
        note: "นอน bench · น้ำหนักที่คุยได้ขณะทำ",
      },
      {
        name: "Cable Chest Fly",
        sets: "3 × 15",
        videoUrl: "https://www.youtube.com/watch?v=ETtXO4FW1EU",
        note: "ตั้งระดับไหล่ · เน้น squeeze หน้าอก",
        tags: ["cable"],
      },
      {
        name: "Seated DB Shoulder Press",
        sets: "3 × 12",
        videoUrl: "https://www.youtube.com/watch?v=1jYq9QQEWqE",
        note: "นั่งบน bench",
      },
      {
        name: "Cable Lateral Raise",
        sets: "3 × 15",
        videoUrl: "https://www.youtube.com/watch?v=Y29xKcze8Ik",
        note: "ทำทีละข้าง",
        tags: ["cable"],
      },
      {
        name: "Cable Tricep Pushdown",
        sets: "3 × 15",
        videoUrl: "https://www.youtube.com/watch?v=d-ySLTHUgQA",
        note: "ใช้ rope · ศอกแนบข้าง",
        tags: ["cable"],
      },
    ],
    home: [
      {
        name: "Dumbbell Floor Press (หนัก)",
        sets: "4 × 10",
        videoUrl: "https://www.youtube.com/watch?v=Bx4QPVH-J1g",
        note: "นอนบนพื้น · ใช้น้ำหนักหนักสุดที่ทำได้",
      },
      {
        name: "Dumbbell Floor Press (Neutral Grip)",
        sets: "3 × 12",
        videoUrl: "https://www.youtube.com/watch?v=oqnNivBhveM",
        note: "หันมือเข้าหากัน · เน้นหน้าอกกลาง ไหล่ไม่เจ็บ",
      },
      {
        name: "Standing DB Shoulder Press",
        sets: "3 × 12",
        videoUrl: "https://www.youtube.com/watch?v=e_f5oodNEcI",
        note: "ยืนทำ · คอร์เกร็งตลอด",
      },
      {
        name: "Dumbbell Lateral Raise",
        sets: "3 × 15",
        videoUrl: "https://www.youtube.com/watch?v=Y29xKcze8Ik",
        note: "ดัมเบลเบา เน้น form",
      },
      {
        name: "Dumbbell Tricep Overhead Extension",
        sets: "3 × 15",
        videoUrl: "https://www.youtube.com/watch?v=X-iV-cG8cYs",
        note: "ดัมเบลอันเดียว 2 มือจับ · ยืนทำ",
      },
    ],
  },
  {
    kind: "dual",
    key: "legs",
    weekday: "อังคาร",
    dayType: "Lower",
    badge: "Legs",
    color: "orange",
    title: "วันอังคาร — Lower",
    subtitle: "ขา / glute / hamstring · 30-35 นาที",
    aclAware: true,
    gym: [
      {
        name: "Dumbbell Goblet Squat",
        sets: "3 × 12",
        videoUrl: "https://www.youtube.com/watch?v=gcNh17Ckjgg",
        note: "ถือดัมเบลหน้าอก · ลงแค่ parallel",
        tags: ["acl"],
      },
      {
        name: "Romanian Deadlift (DB)",
        sets: "3 × 12",
        videoUrl: "https://www.youtube.com/watch?v=XxWcirHIwVo",
        note: "เน้น hamstring · ก้มลงช้าๆ",
      },
      {
        name: "Step-Up with Dumbbell",
        sets: "3 × 10/ข้าง",
        videoUrl: "https://www.youtube.com/watch?v=MyqQRJ2lW7Q",
        note: "step หรือ bench ต่ำ",
        tags: ["acl"],
      },
      {
        name: "Hip Thrust (Dumbbell)",
        sets: "3 × 15",
        videoUrl: "https://www.youtube.com/watch?v=29OfN4ztW_g",
        note: "พิงบน bench",
      },
      {
        name: "Calf Raise",
        sets: "3 × 20",
        videoUrl: "https://www.youtube.com/watch?v=gwLzBJYoWlI",
        note: "ยืนขอบ step",
      },
    ],
    home: [
      {
        name: "Dumbbell Goblet Squat",
        sets: "4 × 10",
        videoUrl: "https://www.youtube.com/watch?v=Xjo_fY9Hl9w",
        note: "ถือดัมเบลหน้าอก · ลงแค่ parallel · เข่าไม่บิดเข้าใน",
        tags: ["acl"],
      },
      {
        name: "Dumbbell Romanian Deadlift",
        sets: "3 × 12",
        videoUrl: "https://www.youtube.com/watch?v=KYIJdN2gBmQ",
        note: "ถือดัมเบล 2 ข้าง · หลังตรง ก้มช้าๆ เน้น hamstring",
      },
      {
        name: "Dumbbell Reverse Lunge",
        sets: "3 × 10/ข้าง",
        videoUrl: "https://www.youtube.com/watch?v=MyqQRJ2lW7Q",
        note: "ถือดัมเบล 2 ข้าง · ก้าวขาถอยหลัง · เข่าหน้าไม่เกินปลายเท้า · ปลอดภัยกว่า forward lunge สำหรับ ACL",
        tags: ["acl"],
      },
      {
        name: "Dumbbell Glute Bridge",
        sets: "3 × 15",
        videoUrl: "https://www.youtube.com/watch?v=0kx1QOzhTCQ",
        note: "นอนหงายบนพื้น · วางดัมเบลบนสะโพก · ไม่ต้องพิงอะไร",
      },
      {
        name: "Dumbbell Calf Raise",
        sets: "3 × 20",
        videoUrl: "https://www.youtube.com/watch?v=gwLzBJYoWlI",
        note: "ถือดัมเบล · ยืนขอบบันไดหรือพื้นปกติ",
      },
    ],
  },
  { kind: "rest", weekday: "พุธ" },
  {
    kind: "single",
    key: "football",
    weekday: "พฤหัส",
    dayType: "เตะบอล ⚽",
    badge: "Football",
    color: "amber",
    title: "วันพฤหัส — เตะบอล ⚽",
    subtitle: "Cardio + Explosive · เผาแคล 900-1,500 kcal",
    columns: ["ช่วง", "เวลา", "รายละเอียด"],
    rows: [
      {
        label: "Warm Up",
        duration: "10 นาที",
        note: "เดินเร็ว → จ็อกเบา → leg swing → hip circle → lateral shuffle",
      },
      {
        label: "เตะบอล",
        duration: "60-90 นาที",
        note: "นับเป็น cardio + legs · เป้า HR 140-175 bpm",
      },
      {
        label: "Cool Down",
        duration: "10 นาที",
        note: "ยืด quad + hamstring + calf · อาบน้ำเย็นลด core temp · สำคัญมาก ACL",
      },
    ],
  },
  { kind: "rest", weekday: "ศุกร์" },
  {
    kind: "dual",
    key: "pull",
    weekday: "เสาร์",
    dayType: "Upper B",
    badge: "Pull",
    color: "violet",
    title: "วันเสาร์ — Upper B (Pull)",
    subtitle: "หลัง / ไบเซป · 30-35 นาที",
    gym: [
      {
        name: "Cable Lat Pulldown",
        sets: "3 × 12",
        videoUrl: "https://www.youtube.com/watch?v=iZdoSM8lFsg",
        note: "ดึงมาหาอก · ไม่เอนหลังมาก",
        tags: ["cable"],
      },
      {
        name: "Cable Seated Row",
        sets: "3 × 12",
        videoUrl: "https://www.youtube.com/watch?v=OeLb503NZHk",
        note: "หลังตรง · ดึงมาหาสะดือ",
        tags: ["cable"],
      },
      {
        name: "Dumbbell Single-Arm Row",
        sets: "3 × 12/ข้าง",
        videoUrl: "https://www.youtube.com/watch?v=pYcpY20QaE8",
        note: "วางเข่าบน bench",
      },
      {
        name: "Cable Face Pull",
        sets: "3 × 15",
        videoUrl: "https://www.youtube.com/watch?v=0Po47vvj9g4",
        note: "ป้องกันไหล่บาดเจ็บระยะยาว",
        tags: ["cable"],
      },
      {
        name: "Dumbbell Bicep Curl",
        sets: "3 × 15",
        videoUrl: "https://www.youtube.com/watch?v=M2Nbw9tunoY",
        note: "ศอกแนบข้าง",
      },
    ],
    home: [
      {
        name: "Dumbbell Deadlift",
        sets: "4 × 10",
        videoUrl: "https://www.youtube.com/watch?v=v7svtgo35oo",
        note: "ถือดัมเบล 2 ข้าง · หลังตรง สะโพกลง · เผาแคลสูงสุด",
      },
      {
        name: "Dumbbell Bent-Over Row (สองมือ)",
        sets: "3 × 10",
        videoUrl: "https://www.youtube.com/watch?v=vhSH7vuOp-M",
        note: "ถือดัมเบล 2 ข้าง · ก้ม 45 องศา · ดึงมาหาสะดือ",
      },
      {
        name: "Dumbbell Single-Arm Row",
        sets: "3 × 12/ข้าง",
        videoUrl: "https://www.youtube.com/watch?v=pYcpY20QaE8",
        note: "วางมือบนผนังแทน bench · ก้มตัว 45 องศา",
      },
      {
        name: "Dumbbell Rear Delt Raise",
        sets: "3 × 15",
        videoUrl: "https://www.youtube.com/watch?v=IXeRFh9nUwk",
        note: "ก้มตัว · ดัมเบลออกด้านข้าง",
      },
      {
        name: "Dumbbell Bicep Curl",
        sets: "3 × 15",
        videoUrl: "https://www.youtube.com/watch?v=M2Nbw9tunoY",
        note: "ศอกแนบข้าง · ไม่แกว่งตัว",
      },
    ],
  },
  {
    kind: "single",
    key: "cardio",
    weekday: "อาทิตย์",
    dayType: "Cardio",
    badge: "LISS",
    color: "emerald",
    title: "วันอาทิตย์ — Cardio LISS",
    subtitle: "30 นาที · HR เป้า 120-135 bpm",
    columns: ["ตัวเลือก", "เวลา", "หมายเหตุ"],
    rows: [
      {
        label: "🏢 ลู่วิ่ง incline (ฟิตเนส)",
        duration: "30 นาที",
        note: "ความเร็ว 5-6 km/h · incline 3-5%",
      },
      {
        label: "🏢 Elliptical (ฟิตเนส)",
        duration: "30 นาที",
        note: "ไม่กระแทกข้อ · ดีสำหรับ ACL",
      },
      {
        label: "🏊 ว่ายน้ำ (สระคอนโด)",
        duration: "30 นาที",
        note: "ดีที่สุดหลังเตะบอลหนัก · ลดแรงกดข้อต่อ",
      },
      {
        label: "🏠 เดินเร็ว (รอบคอนโด/ถนน)",
        duration: "35-40 นาที",
        note: "ถ้าไม่อยากลงฟิตเนส · เดินเร็วๆ HR ให้ถึง 120+",
      },
    ],
    tip: "🏊 Tip: สัปดาห์ไหนเตะบอลนานเกิน 90 นาที → เลือกว่ายน้ำวันอาทิตย์แทนเลยครับ ฟื้นตัวขาได้เร็วกว่ามาก",
  },
];

export const heroStats: { value: string; label: string; className?: string }[] = [
  { value: "4", label: "วัน/สัปดาห์" },
  { value: "30-40", label: "นาที/ครั้ง" },
  { value: "GYM", label: "ฟิตเนสคอนโด", className: "text-primary" },
  { value: "HOME", label: "ดัมเบล+บาร์เบล", className: "text-orange-500 dark:text-orange-400" },
];

export const aclNote =
  "⚠️ ACL Watch — หลีกเลี่ยง jump squat, box jump, เปลี่ยนทิศกะทันหัน · ใส่ knee sleeve ทุกครั้งที่ลงสนาม";

export const nutrition = [
  { value: "2,000", unit: "kcal / วัน", label: "เป้าแคลอรี่" },
  { value: "150g", unit: "โปรตีน", label: "30% · อกไก่ ปลา ไข่" },
  { value: "225g", unit: "คาร์บ", label: "45% · ข้าว 2 มื้อ + ผัก" },
  { value: "56g", unit: "ไขมัน", label: "25% · น้ำมันมะกอก ไข่" },
];

export const tips: { emoji: string; lead: string; rest: string }[] = [
  {
    emoji: "🔀",
    lead: "เลือก mode ได้ทุกวัน",
    rest: "ฟิตเนสเต็มหรือขี้เกียจลงไป → ทำที่ห้องได้เลย ไม่มีข้อแก้ตัว",
  },
  {
    emoji: "🌙",
    lead: "สูตรห้องนอน Biocharge 90+",
    rest: "มืดสนิท + แอร์ 25 องศา + นอนก่อนเที่ยงคืน",
  },
  {
    emoji: "☕",
    lead: "หยุดคาเฟอีนหลังบ่าย 2 โมง",
    rest: "ชาไทย กาแฟ ชาเขียว ล้วนกระทบการนอน",
  },
  {
    emoji: "📈",
    lead: "เพิ่มน้ำหนักทุก 2-3 สัปดาห์",
    rest: "แค่ 1-2 กก. ค่อยๆ progress ไม่รีบ",
  },
  {
    emoji: "🔄",
    lead: "พลาดวันไม่เป็นไร",
    rest: "ข้ามไปวันถัดไปได้เลย ห้ามชดเชยด้วยการออกหนักขึ้น",
  },
  {
    emoji: "⚖️",
    lead: "ชั่งน้ำหนักสัปดาห์ละครั้ง",
    rest: "เช้าหลังตื่นนอน ก่อนกินอาหาร",
  },
];
