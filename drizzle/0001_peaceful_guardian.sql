ALTER TABLE "habits" ADD COLUMN "goal_id" uuid;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_parent_id_goals_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."goals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habits" ADD CONSTRAINT "habits_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "goals_parent_idx" ON "goals" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "habits_goal_idx" ON "habits" USING btree ("goal_id");