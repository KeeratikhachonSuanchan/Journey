// Imports vocab-data/*.json into vocab_cards. Mirrors src/db/seed.ts
// conventions (own postgres client from DATABASE_URL, relative imports, ends
// with client.end()) but lives separately — this is content data, not sample
// data, and shouldn't re-run every time `db:seed` does.
//
// Usage:
//   npm run db:seed:vocab -- --check   (validate only, no DB connection)
//   npm run db:seed:vocab              (validate + upsert into vocab_cards)

import "dotenv/config";
import { config } from "dotenv";
config({ path: ".env.local", override: true });

import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { z } from "zod";
import { sql } from "drizzle-orm";

const VOCAB_DATA_DIR = join(__dirname, "..", "..", "vocab-data");

const VocabCardSchema = z.object({
  id: z.string().min(1),
  word: z.string().min(1),
  meaning: z.string().min(1),
  level: z.enum(["A1", "A2", "B1", "B2"]),
  example: z.string().min(1),
  source: z.enum(["user", "common"]),
  pos: z.string().optional(),
});

type ParsedCard = z.infer<typeof VocabCardSchema>;

function loadAndValidate(): ParsedCard[] {
  const files = readdirSync(VOCAB_DATA_DIR).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    throw new Error(`No .json files found in ${VOCAB_DATA_DIR}`);
  }

  const allCards: ParsedCard[] = [];
  const seenIds = new Map<string, string>(); // id -> file
  const seenWords = new Map<string, string>(); // lowercased word -> file

  for (const file of files.sort()) {
    const raw = JSON.parse(readFileSync(join(VOCAB_DATA_DIR, file), "utf-8"));
    if (!Array.isArray(raw)) {
      throw new Error(`${file}: expected a JSON array at the top level`);
    }

    raw.forEach((record, index) => {
      const result = VocabCardSchema.safeParse(record);
      if (!result.success) {
        throw new Error(
          `${file}[${index}]: ${result.error.issues.map((i) => i.message).join("; ")}\n` +
            `  record: ${JSON.stringify(record)}`
        );
      }
      const card = result.data;

      const priorId = seenIds.get(card.id);
      if (priorId) {
        throw new Error(
          `Duplicate id "${card.id}" in ${file} (already used in ${priorId})`
        );
      }
      seenIds.set(card.id, file);

      const wordKey = card.word.trim().toLowerCase();
      const priorWord = seenWords.get(wordKey);
      if (priorWord) {
        throw new Error(
          `Duplicate word "${card.word}" (id ${card.id}) in ${file} (already used in ${priorWord})`
        );
      }
      seenWords.set(wordKey, file);

      allCards.push(card);
    });

    console.log(`  ${file}: ${raw.length} cards`);
  }

  return allCards;
}

async function main() {
  const checkOnly = process.argv.includes("--check");

  console.log(`Reading vocab-data/ ...`);
  const cards = loadAndValidate();

  const byLevel = cards.reduce<Record<string, number>>((acc, c) => {
    acc[c.level] = (acc[c.level] ?? 0) + 1;
    return acc;
  }, {});
  console.log(
    `Validated ${cards.length} cards — ${Object.entries(byLevel)
      .map(([lvl, n]) => `${lvl}:${n}`)
      .join(" ")}`
  );

  if (checkOnly) {
    console.log("--check passed. No DB connection made.");
    return;
  }

  // Import DB pieces only when actually writing, so --check never needs env vars.
  const { drizzle } = await import("drizzle-orm/postgres-js");
  const postgres = (await import("postgres")).default;
  const { vocabCards } = await import("./schema");
  const { SEED_USER_ID } = await import("../lib/currentUser");

  const client = postgres(process.env.DATABASE_URL!, { prepare: false });
  const db = drizzle(client);

  console.log("Upserting into vocab_cards...");
  const CHUNK = 500;
  let commonCount = 0;
  let userCount = 0;

  for (let i = 0; i < cards.length; i += CHUNK) {
    const chunk = cards.slice(i, i + CHUNK);
    const commonRows = chunk
      .filter((c) => c.source === "common")
      .map((c) => ({ ...c, userId: null }));
    const userRows = chunk
      .filter((c) => c.source === "user")
      .map((c) => ({ ...c, userId: SEED_USER_ID }));

    if (commonRows.length > 0) {
      // Batch files are the source of truth for catalog content — a corrected
      // Thai meaning or example should propagate on re-run. `excluded` refers
      // to the row that was proposed for insertion (the standard Postgres
      // upsert idiom), so this works for a heterogeneous bulk insert without
      // a separate query per row.
      await db
        .insert(vocabCards)
        .values(commonRows)
        .onConflictDoUpdate({
          target: vocabCards.id,
          set: {
            word: sql`excluded.word`,
            meaning: sql`excluded.meaning`,
            level: sql`excluded.level`,
            example: sql`excluded.example`,
            pos: sql`excluded.pos`,
          },
        });
      commonCount += commonRows.length;
    }

    if (userRows.length > 0) {
      // The 61 supplied user words are verified; never overwrite user edits.
      await db.insert(vocabCards).values(userRows).onConflictDoNothing();
      userCount += userRows.length;
    }

    console.log(`  upserted ${Math.min(i + CHUNK, cards.length)}/${cards.length}`);
  }

  console.log(`Done. common: ${commonCount}, user: ${userCount}`);
  await client.end();
}

main().catch((e) => {
  console.error("seed-vocab failed:", e.message ?? e);
  process.exit(1);
});
