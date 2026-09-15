CREATE TYPE "public"."english_phase" AS ENUM('foundation_fix', 'listening_immersion', 'shadowing', 'real_conversation', 'role_play', 'reading_writing');--> statement-breakpoint
CREATE TYPE "public"."review_result" AS ENUM('again', 'hard', 'good', 'easy');--> statement-breakpoint
CREATE TYPE "public"."vocab_level" AS ENUM('A1', 'A2', 'B1', 'B2');--> statement-breakpoint
CREATE TYPE "public"."vocab_source" AS ENUM('user', 'common');--> statement-breakpoint
CREATE TABLE "english_practice_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"phase" "english_phase" NOT NULL,
	"item_key" text NOT NULL,
	"occurred_on" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocab_cards" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"word" text NOT NULL,
	"meaning" text NOT NULL,
	"level" "vocab_level" NOT NULL,
	"example" text NOT NULL,
	"source" "vocab_source" NOT NULL,
	"pos" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vocab_card_source_owner" CHECK ((source = 'common' AND user_id IS NULL) OR (source = 'user' AND user_id IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "vocab_review_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"card_id" text NOT NULL,
	"result" "review_result" NOT NULL,
	"box_after" integer NOT NULL,
	"occurred_on" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocab_review_states" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"card_id" text NOT NULL,
	"box" integer DEFAULT 1 NOT NULL,
	"due_date" date NOT NULL,
	"last_reviewed_on" date,
	"introduced_on" date NOT NULL,
	"total_reviews" integer DEFAULT 0 NOT NULL,
	"correct_streak" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vocab_review_states_box_range" CHECK (box >= 1 AND box <= 6)
);
--> statement-breakpoint
ALTER TABLE "english_practice_logs" ADD CONSTRAINT "english_practice_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocab_cards" ADD CONSTRAINT "vocab_cards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocab_review_logs" ADD CONSTRAINT "vocab_review_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocab_review_logs" ADD CONSTRAINT "vocab_review_logs_card_id_vocab_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."vocab_cards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocab_review_states" ADD CONSTRAINT "vocab_review_states_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocab_review_states" ADD CONSTRAINT "vocab_review_states_card_id_vocab_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."vocab_cards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "english_practice_logs_user_date_idx" ON "english_practice_logs" USING btree ("user_id","occurred_on");--> statement-breakpoint
CREATE INDEX "english_practice_logs_user_phase_idx" ON "english_practice_logs" USING btree ("user_id","phase");--> statement-breakpoint
CREATE INDEX "vocab_cards_user_level_idx" ON "vocab_cards" USING btree ("user_id","level");--> statement-breakpoint
CREATE INDEX "vocab_cards_word_idx" ON "vocab_cards" USING btree ("word");--> statement-breakpoint
CREATE INDEX "vocab_review_logs_user_date_idx" ON "vocab_review_logs" USING btree ("user_id","occurred_on");--> statement-breakpoint
CREATE UNIQUE INDEX "vocab_review_states_user_card_idx" ON "vocab_review_states" USING btree ("user_id","card_id");--> statement-breakpoint
CREATE INDEX "vocab_review_states_user_due_idx" ON "vocab_review_states" USING btree ("user_id","due_date");--> statement-breakpoint
CREATE INDEX "vocab_review_states_user_introduced_idx" ON "vocab_review_states" USING btree ("user_id","introduced_on");