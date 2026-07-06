"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useT } from "@/lib/i18n/context";

export function ReflectionFields() {
  const t = useT();

  return (
    <>
      <Select
        name="outcome"
        required
        items={{
          achieved: t.enums.outcome.achieved,
          partial: t.enums.outcome.partial,
          missed: t.enums.outcome.missed,
        }}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder={t.today.outcome} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="achieved">{t.enums.outcome.achieved}</SelectItem>
          <SelectItem value="partial">{t.enums.outcome.partial}</SelectItem>
          <SelectItem value="missed">{t.enums.outcome.missed}</SelectItem>
        </SelectContent>
      </Select>

      <Input
        name="reason"
        placeholder={t.today.whyPlaceholder}
        className="flex-1 min-w-[200px]"
      />

      <Select
        name="reasonTag"
        items={{
          time: t.enums.reasonTag.time,
          scope: t.enums.reasonTag.scope,
          motivation: t.enums.reasonTag.motivation,
          external: t.enums.reasonTag.external,
          other: t.enums.reasonTag.other,
        }}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder={t.today.tag} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="time">{t.enums.reasonTag.time}</SelectItem>
          <SelectItem value="scope">{t.enums.reasonTag.scope}</SelectItem>
          <SelectItem value="motivation">
            {t.enums.reasonTag.motivation}
          </SelectItem>
          <SelectItem value="external">{t.enums.reasonTag.external}</SelectItem>
          <SelectItem value="other">{t.enums.reasonTag.other}</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
