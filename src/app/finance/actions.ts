"use server";

import { db } from "@/db";
import { budgets, categories, transactions } from "@/db/schema";
import { getCurrentUserId } from "@/lib/currentUser";
import { eq, and, gte, lt } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { formatDate } from "@/lib/dates";
import { addMonths } from "date-fns";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SUPPORTED_SLIP_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

const SLIP_SCHEMA = {
  type: "object",
  properties: {
    amount: {
      anyOf: [{ type: "string" }, { type: "null" }],
      description:
        'The transaction amount as a plain decimal string (e.g. "250.00"), or null if it cannot be read clearly.',
    },
    occurredOn: {
      anyOf: [{ type: "string" }, { type: "null" }],
      description:
        "The transaction date in YYYY-MM-DD format, or null if it cannot be read clearly.",
    },
    note: {
      anyOf: [{ type: "string" }, { type: "null" }],
      description:
        "A short note built from the sender/receiver name or merchant shown on the slip, or null.",
    },
  },
  required: ["amount", "occurredOn", "note"],
  additionalProperties: false,
};

export type SlipExtraction = {
  amount: string | null;
  occurredOn: string | null;
  note: string | null;
};

const EMPTY_SLIP_EXTRACTION: SlipExtraction = {
  amount: null,
  occurredOn: null,
  note: null,
};

export async function extractSlipData(
  formData: FormData
): Promise<SlipExtraction> {
  const file = formData.get("slipImage") as File | null;
  if (
    !file ||
    !SUPPORTED_SLIP_IMAGE_TYPES.includes(
      file.type as (typeof SUPPORTED_SLIP_IMAGE_TYPES)[number]
    )
  ) {
    return EMPTY_SLIP_EXTRACTION;
  }

  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 300,
      output_config: { format: { type: "json_schema", schema: SLIP_SCHEMA } },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: file.type as (typeof SUPPORTED_SLIP_IMAGE_TYPES)[number],
                data: base64,
              },
            },
            {
              type: "text",
              text: "This is a photo of a Thai bank transfer slip. Extract the transaction amount, the transaction date, and a short note built from the sender/receiver name or merchant shown. If a field cannot be read clearly, use null for it rather than guessing.",
            },
          ],
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return EMPTY_SLIP_EXTRACTION;
    }

    return JSON.parse(textBlock.text) as SlipExtraction;
  } catch {
    return EMPTY_SLIP_EXTRACTION;
  }
}

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
