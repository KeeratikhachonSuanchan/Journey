ALTER TYPE "public"."cadence" ADD VALUE 'monthly';--> statement-breakpoint
ALTER TYPE "public"."cadence" ADD VALUE 'quarterly';--> statement-breakpoint
ALTER TABLE "goals" ADD COLUMN "period_end" date;--> statement-breakpoint
DROP INDEX "goals_user_period_idx";--> statement-breakpoint
ALTER TABLE "goals" DROP COLUMN "period_type";--> statement-breakpoint
DROP TYPE "public"."period_type";--> statement-breakpoint
CREATE INDEX "goals_user_period_idx" ON "goals" USING btree ("user_id","period_start","period_end");
