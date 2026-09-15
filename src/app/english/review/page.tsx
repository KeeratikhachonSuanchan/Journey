export const dynamic = "force-dynamic";

import { getReviewQueue } from "../actions";
import { ReviewSession } from "./review-session";
import { SectionNav } from "../section-nav";
import { Card, CardContent } from "@/components/ui/card";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function ReviewPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const { cards, dueTotal } = await getReviewQueue();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h1 className="text-xl font-semibold tracking-tight">{dict.english.tabReview}</h1>
        <SectionNav active="review" t={dict.english} />
      </div>

      {cards.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {dict.english.noCardsDue}
            <div className="mt-1 text-xs">{dict.english.noCardsDueSub}</div>
          </CardContent>
        </Card>
      ) : (
        <ReviewSession cards={cards} dueTotal={dueTotal} />
      )}
    </div>
  );
}
