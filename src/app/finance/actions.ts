"use server";

import { db } from "@/db";
import { budgets, categories, transactions } from "@/db/schema";
import { getCurrentUserId } from "@/lib/currentUser";
import { eq, and, gte, lt } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { formatDate } from "@/lib/dates";
import { addMonths } from "date-fns";

export async function upsertBudget(formData: FormData) {
  const userId = getCurrentUserId();
  const month = formData.get("month") as string;
  const income = formData.get("income") as string;
  const needsRatio = parseInt(formData.get("needsRatio") as string);
  const wantsRatio = parseInt(formData.get("wantsRatio") as string);
  const savingsRatio = parseInt(formData.get("savingsRatio") as string);

  const existing = await db
    .select()
    .from(budgets)
    .where(and(eq(budgets.userId, userId), eq(budgets.month, month)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(budgets)
      .set({ income, needsRatio, wantsRatio, savingsRatio })
      .where(eq(budgets.id, existing[0].id));
  } else {
    await db.insert(budgets).values({
      userId,
      month,
      income,
      needsRatio,
      wantsRatio,
      savingsRatio,
    });
  }

  revalidatePath("/finance");
}

export async function addCategory(formData: FormData) {
  const userId = getCurrentUserId();
  const name = formData.get("name") as string;
  const bucket = formData.get("bucket") as "needs" | "wants" | "savings";

  await db.insert(categories).values({ userId, name, bucket });
  revalidatePath("/finance");
}

export async function deleteCategory(categoryId: string) {
  await db.delete(categories).where(eq(categories.id, categoryId));
  revalidatePath("/finance");
}

export async function addTransaction(formData: FormData) {
  const userId = getCurrentUserId();
  const categoryId = formData.get("categoryId") as string;
  const amount = formData.get("amount") as string;
  const occurredOn = formData.get("occurredOn") as string;
  const note = (formData.get("note") as string) || null;

  await db.insert(transactions).values({
    userId,
    categoryId,
    amount,
    occurredOn,
    note,
  });

  revalidatePath("/finance");
}

export async function deleteTransaction(transactionId: string) {
  await db.delete(transactions).where(eq(transactions.id, transactionId));
  revalidatePath("/finance");
}

export async function getFinanceData(monthDate: Date) {
  const userId = getCurrentUserId();
  const monthStr = formatDate(monthDate);
  const nextMonthStr = formatDate(addMonths(monthDate, 1));

  const [budget] = await db
    .select()
    .from(budgets)
    .where(and(eq(budgets.userId, userId), eq(budgets.month, monthStr)))
    .limit(1);

  const userCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId));

  const monthTransactions = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        gte(transactions.occurredOn, monthStr),
        lt(transactions.occurredOn, nextMonthStr)
      )
    );

  return {
    budget: budget ?? null,
    categories: userCategories,
    transactions: monthTransactions,
  };
}
