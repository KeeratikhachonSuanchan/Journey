import { Badge } from "@/components/ui/badge";
import { MASTERED_BOX } from "@/lib/srs/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

// box === null means the card has no review state yet (never answered).
export function BoxBadge({ box, t }: { box: number | null; t: Dictionary["english"] }) {
  if (box === null) {
    return <Badge variant="outline">{t.notStartedLabel}</Badge>;
  }
  if (box >= MASTERED_BOX) {
    return <Badge variant="default">{t.mastered}</Badge>;
  }
  return <Badge variant="secondary">{t.boxLabel(box)}</Badge>;
}
