"use client";

import { useState } from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { format, parseISO } from "date-fns";
import { enUS, th } from "date-fns/locale";
import { CalendarIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/dates";
import { useLocale } from "@/lib/i18n/context";

export function DatePicker({
  name,
  defaultValue,
  required,
  placeholder = "Pick a date",
  id,
  className,
}: {
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  placeholder?: string;
  id?: string;
  className?: string;
}) {
  const locale = useLocale();
  const dfnsLocale = locale === "th" ? th : enUS;

  const [value, setValue] = useState<Date | undefined>(
    defaultValue ? parseISO(defaultValue) : undefined
  );
  const [month, setMonth] = useState<Date>(value ?? new Date());
  const [open, setOpen] = useState(false);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <div className="relative" data-slot="date-picker">
        <PopoverPrimitive.Trigger
          id={id}
          render={
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-start gap-2 font-normal",
                !value && "text-muted-foreground",
                className
              )}
            />
          }
        >
          <CalendarIcon className="size-4 shrink-0" />
          {value ? format(value, "d MMM yyyy", { locale: dfnsLocale }) : placeholder}
        </PopoverPrimitive.Trigger>
        {value && !required && (
          <button
            type="button"
            aria-label="Clear date"
            className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              setValue(undefined);
            }}
          >
            <XIcon className="size-3.5" />
          </button>
        )}
      </div>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          side="bottom"
          align="start"
          sideOffset={4}
          className="isolate z-50"
        >
          <PopoverPrimitive.Popup
            data-slot="date-picker-content"
            className="origin-(--transform-origin) rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          >
            <Calendar
              selected={value}
              month={month}
              onMonthChange={setMonth}
              onSelect={(day) => {
                setValue(day);
                setOpen(false);
              }}
            />
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>

      <input
        type="date"
        name={name}
        required={required}
        value={value ? formatDate(value) : ""}
        onChange={() => {}}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      />
    </PopoverPrimitive.Root>
  );
}
