export interface Dictionary {
  nav: {
    dashboard: string;
    finance: string;
    today: string;
    goals: string;
    workout: string;
  };
  common: {
    save: string;
    add: string;
    delete: string;
    back: string;
    optional: string;
    cancel: string;
    options: string;
  };
  dashboard: {
    title: string;
    thisMonthsBudget: string;
    viewFinance: string;
    noBudgetSet: string;
    setUpBudget: string;
    thisWeeksProgress: string;
    weeklyReview: string;
    goalsCard: string;
    habitsCard: string;
    noGoalsThisWeek: string;
    createOne: string;
    noActiveHabits: string;
    activeGoals: string;
    goalsAchieved: (achieved: number, total: number) => string;
    checkInsAchieved: (achieved: number, total: number) => string;
    heroPending: (count: number) => string;
    heroPendingSub: string;
    heroAllDone: string;
    heroAllDoneSub: string;
    heroNoItems: string;
    heroNoItemsSub: string;
    heroGoToToday: string;
  };
  finance: {
    title: string;
    monthlyReview: string;
    monthlyBudget: string;
    monthlyIncome: string;
    needsPercent: string;
    wantsPercent: string;
    savingsPercent: string;
    saveBudget: string;
    categories: string;
    categoryName: string;
    noCategoriesYet: string;
    addTransaction: string;
    addCategoriesFirst: string;
    amount: string;
    category: string;
    selectCategory: string;
    date: string;
    note: string;
    whatWasThisFor: string;
    transactions: (count: number) => string;
    noTransactionsThisMonth: string;
    of: string;
    target: string;
    remaining: string;
    over: string;
    backToFinance: string;
  };
  review: {
    overall: string;
    withinPlan: string;
    overBudget: string;
    spentVsTarget: string;
    topCategories: string;
    noSpendingData: string;
  };
  goals: {
    title: string;
    newGoal: string;
    goalTitle: string;
    goalTitlePlaceholder: string;
    domain: string;
    periodStart: string;
    periodEnd: string;
    createGoal: string;
    editGoal: string;
    newHabit: string;
    habitTitlePlaceholder: string;
    cadence: string;
    createHabit: string;
    editHabit: string;
    goalsCount: (count: number) => string;
    habitsCount: (count: number) => string;
    noGoalsYet: string;
    noHabitsYet: string;
    active: string;
    paused: string;
    backToGoals: string;
    delete: string;
    cancel: string;
    deleteGoalTitle: string;
    loadingDeletePreview: string;
    deleteGoalWarning: (info: {
      title: string;
      children: number;
      habits: number;
      reflections: number;
    }) => string;
    willDeleteChildren: string;
    deleteHabitTitle: string;
    deleteHabitWarning: (info: { title: string; reflections: number }) => string;
    reflectionHistory: (count: number) => string;
    noReflectionsYet: string;
    linkToGoal: string;
    none: string;
    forGoal: (title: string) => string;
    relatedItems: string;
    linkedHabits: (count: number) => string;
    childGoals: (count: number) => string;
    noLinkedHabits: string;
    noChildGoals: string;
  };
  goalsReview: {
    title: string;
    weekOf: (start: string, end: string) => string;
    goalsAchievement: string;
    habitsAchievement: string;
    goalsAchieved: (achieved: number, total: number) => string;
    checkInsAchieved: (achieved: number, total: number) => string;
    reasonsForMisses: (count: number) => string;
    noMissedReasons: string;
  };
  today: {
    title: string;
    noItemsToday: string;
    habits: string;
    outcome: string;
    whyPlaceholder: string;
    tag: string;
    toDoTab: (count: number) => string;
    completedTab: (count: number) => string;
    noPendingItems: string;
    noCompletedItems: string;
    testReminderButton: string;
    testReminderSending: string;
    testReminderSent: (count: number) => string;
    testReminderNothingPending: string;
    testReminderFailed: string;
    reminderTimeLabel: string;
    reminderTimeSaved: string;
    reminderTimeFailed: string;
  };
  enums: {
    outcome: {
      achieved: string;
      partial: string;
      missed: string;
    };
    status: {
      open: string;
      achieved: string;
      partial: string;
      missed: string;
    };
    bucket: {
      needs: string;
      wants: string;
      savings: string;
    };
    cadence: {
      daily: string;
      weekly: string;
      monthly: string;
      quarterly: string;
    };
    domain: {
      finance: string;
      dev: string;
    };
    reasonTag: {
      time: string;
      scope: string;
      motivation: string;
      external: string;
      other: string;
    };
  };
}

export const en: Dictionary = {
  nav: {
    dashboard: "Dashboard",
    finance: "Finance",
    today: "Today",
    goals: "Goals",
    workout: "Workout",
  },
  common: {
    save: "Save",
    add: "Add",
    delete: "Delete",
    back: "Back",
    optional: "optional",
    cancel: "Cancel",
    options: "Options",
  },
  dashboard: {
    title: "Dashboard",
    thisMonthsBudget: "This Month's Budget",
    viewFinance: "View Finance",
    noBudgetSet: "No budget set for this month.",
    setUpBudget: "Set up your budget",
    thisWeeksProgress: "This Week's Progress",
    weeklyReview: "Weekly Review",
    goalsCard: "Goals",
    habitsCard: "To-dos",
    noGoalsThisWeek: "No goals this week.",
    createOne: "Create one",
    noActiveHabits: "No active to-dos.",
    activeGoals: "Active Goals",
    goalsAchieved: (achieved: number, total: number) =>
      `${achieved} of ${total} goals achieved`,
    checkInsAchieved: (achieved: number, total: number) =>
      `${achieved} of ${total} check-ins achieved`,
    heroPending: (count: number) => `${count}`,
    heroPendingSub: "left to review today",
    heroAllDone: "All done",
    heroAllDoneSub: "Nothing left to review today",
    heroNoItems: "Nothing today",
    heroNoItemsSub: "No goals or to-dos scheduled for today",
    heroGoToToday: "Go to Today",
  },
  finance: {
    title: "Finance",
    monthlyReview: "Monthly Review",
    monthlyBudget: "Monthly Budget",
    monthlyIncome: "Monthly Income",
    needsPercent: "Needs %",
    wantsPercent: "Wants %",
    savingsPercent: "Savings %",
    saveBudget: "Save Budget",
    categories: "Categories",
    categoryName: "Category name",
    noCategoriesYet: "No categories yet.",
    addTransaction: "Add Transaction",
    addCategoriesFirst: "Add categories first to log transactions.",
    amount: "Amount",
    category: "Category",
    selectCategory: "Select category",
    date: "Date",
    note: "Note",
    whatWasThisFor: "What was this for?",
    transactions: (count: number) => `Transactions (${count})`,
    noTransactionsThisMonth: "No transactions this month.",
    of: "of",
    target: "target",
    remaining: "remaining",
    over: "over",
    backToFinance: "Back to Finance",
  },
  review: {
    overall: "Overall",
    withinPlan: "Within Plan",
    overBudget: "Over Budget",
    spentVsTarget: "Spent vs Target",
    topCategories: "Top Categories",
    noSpendingData: "No spending data.",
  },
  goals: {
    title: "Goals & To-dos",
    newGoal: "New Goal",
    goalTitle: "Title",
    goalTitlePlaceholder: "What do you want to achieve?",
    domain: "Domain",
    periodStart: "Period Start",
    periodEnd: "Period End",
    createGoal: "Create Goal",
    editGoal: "Edit Goal",
    newHabit: "New To-do",
    habitTitlePlaceholder: "What do you need to do?",
    cadence: "Cadence",
    createHabit: "Create To-do",
    editHabit: "Edit To-do",
    goalsCount: (count: number) => `Goals (${count})`,
    habitsCount: (count: number) => `To-dos (${count})`,
    noGoalsYet: "No goals yet.",
    noHabitsYet: "No to-dos yet.",
    active: "Active",
    paused: "Paused",
    backToGoals: "Back to Goals",
    delete: "Delete",
    cancel: "Cancel",
    deleteGoalTitle: "Delete this goal?",
    loadingDeletePreview: "Checking what's linked to this goal...",
    deleteGoalWarning: ({ title, children, habits, reflections }) =>
      `This will permanently delete "${title}"${
        children ? `, ${children} linked goal${children === 1 ? "" : "s"}` : ""
      }${habits ? `, ${habits} to-do${habits === 1 ? "" : "s"}` : ""}${
        reflections ? `, and ${reflections} reflection${reflections === 1 ? "" : "s"}` : ""
      }. This cannot be undone.`,
    willDeleteChildren: "Goals that will also be deleted:",
    deleteHabitTitle: "Delete this to-do?",
    deleteHabitWarning: ({ title, reflections }) =>
      `This will permanently delete "${title}"${
        reflections ? ` and ${reflections} reflection${reflections === 1 ? "" : "s"}` : ""
      }. This cannot be undone.`,
    reflectionHistory: (count: number) => `Reflection History (${count})`,
    noReflectionsYet:
      "No reflections yet. Review this goal on the Today page.",
    linkToGoal: "Link to goal",
    none: "None",
    forGoal: (title: string) => `For: ${title}`,
    relatedItems: "Related",
    linkedHabits: (count: number) => `Linked To-dos (${count})`,
    childGoals: (count: number) => `Child Goals (${count})`,
    noLinkedHabits: "No to-dos linked to this goal.",
    noChildGoals: "No child goals linked to this goal.",
  },
  goalsReview: {
    title: "Weekly Review",
    weekOf: (start: string, end: string) => `Week of ${start} to ${end}`,
    goalsAchievement: "Goals Achievement",
    habitsAchievement: "To-dos Achievement",
    goalsAchieved: (achieved: number, total: number) =>
      `${achieved} of ${total} goals achieved`,
    checkInsAchieved: (achieved: number, total: number) =>
      `${achieved} of ${total} check-ins achieved`,
    reasonsForMisses: (count: number) => `Reasons for Misses (${count})`,
    noMissedReasons: "No missed items with reasons this week.",
  },
  today: {
    title: "Today",
    noItemsToday:
      "No goals or to-dos for today. Create some on the Goals page!",
    habits: "To-dos",
    outcome: "Outcome",
    whyPlaceholder: "Why? (optional but valuable)",
    tag: "Tag",
    toDoTab: (count: number) => `To Do (${count})`,
    completedTab: (count: number) => `Completed (${count})`,
    noPendingItems: "Nothing left to review — nice work!",
    noCompletedItems: "Nothing completed yet today.",
    testReminderButton: "Send test LINE reminder",
    testReminderSending: "Sending…",
    testReminderSent: (count: number) => `Sent (${count} pending)`,
    testReminderNothingPending: "Nothing pending — no message sent",
    testReminderFailed: "Failed to send",
    reminderTimeLabel: "Daily reminder time",
    reminderTimeSaved: "Saved",
    reminderTimeFailed: "Failed to save",
  },
  enums: {
    outcome: {
      achieved: "Achieved",
      partial: "Partial",
      missed: "Missed",
    },
    status: {
      open: "Open",
      achieved: "Achieved",
      partial: "Partial",
      missed: "Missed",
    },
    bucket: {
      needs: "Needs",
      wants: "Wants",
      savings: "Savings",
    },
    cadence: {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      quarterly: "Quarterly",
    },
    domain: {
      finance: "Finance",
      dev: "Self-Development",
    },
    reasonTag: {
      time: "Time",
      scope: "Scope",
      motivation: "Motivation",
      external: "External",
      other: "Other",
    },
  },
};

export const th: Dictionary = {
  nav: {
    dashboard: "แดชบอร์ด",
    finance: "การเงิน",
    today: "วันนี้",
    goals: "เป้าหมาย",
    workout: "ออกกำลังกาย",
  },
  common: {
    save: "บันทึก",
    add: "เพิ่ม",
    delete: "ลบ",
    back: "กลับ",
    optional: "ไม่บังคับ",
    cancel: "ยกเลิก",
    options: "ตัวเลือก",
  },
  dashboard: {
    title: "แดชบอร์ด",
    thisMonthsBudget: "งบประมาณเดือนนี้",
    viewFinance: "ดูการเงิน",
    noBudgetSet: "ยังไม่ได้ตั้งงบประมาณเดือนนี้",
    setUpBudget: "ตั้งค่างบประมาณ",
    thisWeeksProgress: "ความคืบหน้าสัปดาห์นี้",
    weeklyReview: "รีวิวรายสัปดาห์",
    goalsCard: "เป้าหมาย",
    habitsCard: "สิ่งที่ต้องทำ",
    noGoalsThisWeek: "ไม่มีเป้าหมายในสัปดาห์นี้",
    createOne: "สร้างเป้าหมาย",
    noActiveHabits: "ไม่มีสิ่งที่ต้องทำที่ใช้งานอยู่",
    activeGoals: "เป้าหมายที่กำลังดำเนินการ",
    goalsAchieved: (achieved: number, total: number) =>
      `สำเร็จ ${achieved} จาก ${total} เป้าหมาย`,
    checkInsAchieved: (achieved: number, total: number) =>
      `สำเร็จ ${achieved} จาก ${total} ครั้ง`,
    heroPending: (count: number) => `${count}`,
    heroPendingSub: "รายการรอรีวิววันนี้",
    heroAllDone: "ทำครบแล้ว",
    heroAllDoneSub: "ไม่มีอะไรต้องรีวิวแล้ววันนี้",
    heroNoItems: "วันนี้ว่าง",
    heroNoItemsSub: "ไม่มีเป้าหมายหรือสิ่งที่ต้องทำสำหรับวันนี้",
    heroGoToToday: "ไปหน้าวันนี้",
  },
  finance: {
    title: "การเงิน",
    monthlyReview: "รีวิวรายเดือน",
    monthlyBudget: "งบประมาณรายเดือน",
    monthlyIncome: "รายได้ต่อเดือน",
    needsPercent: "จำเป็น %",
    wantsPercent: "อยากได้ %",
    savingsPercent: "เงินออม %",
    saveBudget: "บันทึกงบประมาณ",
    categories: "หมวดหมู่",
    categoryName: "ชื่อหมวดหมู่",
    noCategoriesYet: "ยังไม่มีหมวดหมู่",
    addTransaction: "เพิ่มรายการ",
    addCategoriesFirst: "เพิ่มหมวดหมู่ก่อนเพื่อบันทึกรายการ",
    amount: "จำนวนเงิน",
    category: "หมวดหมู่",
    selectCategory: "เลือกหมวดหมู่",
    date: "วันที่",
    note: "บันทึกเพิ่มเติม",
    whatWasThisFor: "รายการนี้คืออะไร?",
    transactions: (count: number) => `รายการ (${count})`,
    noTransactionsThisMonth: "ไม่มีรายการในเดือนนี้",
    of: "จาก",
    target: "เป้าหมาย",
    remaining: "คงเหลือ",
    over: "เกิน",
    backToFinance: "กลับไปการเงิน",
  },
  review: {
    overall: "ภาพรวม",
    withinPlan: "อยู่ในแผน",
    overBudget: "เกินงบ",
    spentVsTarget: "ใช้จ่ายเทียบเป้าหมาย",
    topCategories: "หมวดหมู่ที่ใช้จ่ายสูงสุด",
    noSpendingData: "ไม่มีข้อมูลการใช้จ่าย",
  },
  goals: {
    title: "เป้าหมายและสิ่งที่ต้องทำ",
    newGoal: "เป้าหมายใหม่",
    goalTitle: "ชื่อเป้าหมาย",
    goalTitlePlaceholder: "คุณอยากบรรลุอะไร?",
    domain: "ด้าน",
    periodStart: "เริ่มต้นช่วงเวลา",
    periodEnd: "สิ้นสุดช่วงเวลา",
    createGoal: "สร้างเป้าหมาย",
    editGoal: "แก้ไขเป้าหมาย",
    newHabit: "สิ่งที่ต้องทำใหม่",
    habitTitlePlaceholder: "อยากสร้างสิ่งที่ต้องทำอะไร?",
    cadence: "ความถี่",
    createHabit: "สร้างสิ่งที่ต้องทำ",
    editHabit: "แก้ไขสิ่งที่ต้องทำ",
    goalsCount: (count: number) => `เป้าหมาย (${count})`,
    habitsCount: (count: number) => `สิ่งที่ต้องทำ (${count})`,
    noGoalsYet: "ยังไม่มีเป้าหมาย",
    noHabitsYet: "ยังไม่มีสิ่งที่ต้องทำ",
    active: "ใช้งานอยู่",
    paused: "หยุดชั่วคราว",
    backToGoals: "กลับไปเป้าหมาย",
    delete: "ลบ",
    cancel: "ยกเลิก",
    deleteGoalTitle: "ลบเป้าหมายนี้?",
    loadingDeletePreview: "กำลังตรวจสอบข้อมูลที่ผูกกับเป้าหมายนี้...",
    deleteGoalWarning: ({ title, children, habits, reflections }) =>
      `การลบนี้จะลบ "${title}"${children ? `, เป้าหมายย่อย ${children} รายการ` : ""}${
        habits ? `, สิ่งที่ต้องทำ ${habits} รายการ` : ""
      }${
        reflections ? ` และการรีวิว ${reflections} รายการ` : ""
      } อย่างถาวร ไม่สามารถกู้คืนได้`,
    willDeleteChildren: "เป้าหมายย่อยที่จะถูกลบไปด้วย:",
    deleteHabitTitle: "ลบสิ่งที่ต้องทำนี้?",
    deleteHabitWarning: ({ title, reflections }) =>
      `การลบนี้จะลบ "${title}"${
        reflections ? ` และการรีวิว ${reflections} รายการ` : ""
      } อย่างถาวร ไม่สามารถกู้คืนได้`,
    reflectionHistory: (count: number) => `ประวัติการรีวิว (${count})`,
    noReflectionsYet: "ยังไม่มีการรีวิว ไปรีวิวเป้าหมายนี้ที่หน้าวันนี้",
    linkToGoal: "ผูกกับเป้าหมาย",
    none: "ไม่ผูก",
    forGoal: (title: string) => `เพื่อ: ${title}`,
    relatedItems: "ที่เกี่ยวข้อง",
    linkedHabits: (count: number) => `สิ่งที่ต้องทำที่ผูกไว้ (${count})`,
    childGoals: (count: number) => `เป้าหมายย่อย (${count})`,
    noLinkedHabits: "ยังไม่มีสิ่งที่ต้องทำที่ผูกกับเป้าหมายนี้",
    noChildGoals: "ยังไม่มีเป้าหมายย่อยที่ผูกกับเป้าหมายนี้",
  },
  goalsReview: {
    title: "รีวิวรายสัปดาห์",
    weekOf: (start: string, end: string) => `สัปดาห์ ${start} ถึง ${end}`,
    goalsAchievement: "ความสำเร็จของเป้าหมาย",
    habitsAchievement: "ความสำเร็จของสิ่งที่ต้องทำ",
    goalsAchieved: (achieved: number, total: number) =>
      `สำเร็จ ${achieved} จาก ${total} เป้าหมาย`,
    checkInsAchieved: (achieved: number, total: number) =>
      `สำเร็จ ${achieved} จาก ${total} ครั้ง`,
    reasonsForMisses: (count: number) => `เหตุผลที่พลาด (${count})`,
    noMissedReasons: "ไม่มีรายการที่พลาดพร้อมเหตุผลในสัปดาห์นี้",
  },
  today: {
    title: "วันนี้",
    noItemsToday: "ไม่มีเป้าหมายหรือสิ่งที่ต้องทำสำหรับวันนี้ ไปสร้างที่หน้าเป้าหมายได้เลย!",
    habits: "สิ่งที่ต้องทำ",
    outcome: "ผลลัพธ์",
    whyPlaceholder: "ทำไม? (ไม่บังคับแต่มีประโยชน์มาก)",
    tag: "แท็ก",
    toDoTab: (count: number) => `ต้องทำ (${count})`,
    completedTab: (count: number) => `ทำแล้ว (${count})`,
    noPendingItems: "ไม่มีอะไรต้องรีวิวแล้ว เก่งมาก!",
    noCompletedItems: "วันนี้ยังไม่มีรายการที่ทำสำเร็จ",
    testReminderButton: "ทดสอบส่งแจ้งเตือน LINE",
    testReminderSending: "กำลังส่ง...",
    testReminderSent: (count: number) => `ส่งแล้ว (${count} รายการค้าง)`,
    testReminderNothingPending: "ไม่มีรายการค้าง เลยไม่ได้ส่ง",
    testReminderFailed: "ส่งไม่สำเร็จ",
    reminderTimeLabel: "เวลาแจ้งเตือนประจำวัน",
    reminderTimeSaved: "บันทึกแล้ว",
    reminderTimeFailed: "บันทึกไม่สำเร็จ",
  },
  enums: {
    outcome: {
      achieved: "สำเร็จ",
      partial: "สำเร็จบางส่วน",
      missed: "พลาด",
    },
    status: {
      open: "เปิดอยู่",
      achieved: "สำเร็จ",
      partial: "สำเร็จบางส่วน",
      missed: "พลาด",
    },
    bucket: {
      needs: "จำเป็น",
      wants: "อยากได้",
      savings: "เงินออม",
    },
    cadence: {
      daily: "ทุกวัน",
      weekly: "ทุกสัปดาห์",
      monthly: "ทุกเดือน",
      quarterly: "ทุกไตรมาส",
    },
    domain: {
      finance: "การเงิน",
      dev: "พัฒนาตนเอง",
    },
    reasonTag: {
      time: "เวลา",
      scope: "ขอบเขต",
      motivation: "แรงจูงใจ",
      external: "ปัจจัยภายนอก",
      other: "อื่นๆ",
    },
  },
};
