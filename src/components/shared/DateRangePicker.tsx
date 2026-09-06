import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { DateRange, Matcher } from "react-day-picker";
import { useTranslation } from "react-i18next";

interface DateRangePickerProps {
  /** Fecha seleccionada (controlado). */
  value?: DateRange;
  /** Se dispara al elegir una fecha. */
  onChange: (date: DateRange | undefined) => void;
  /** Texto cuando no hay fecha elegida. */
  placeholder?: string;
  /** Deshabilita el trigger. */
  disabled?: boolean;
  /** id para asociar con un <FieldLabel htmlFor>. */
  id?: string;
  /**
   * Días no seleccionables en el calendario (matchers de react-day-picker).
   * Ej. `{ before: otraFecha }` para bloquear fechas anteriores.
   */
  disabledDates?: Matcher | Matcher[];
}

const DateRangePicker = ({
  value,
  onChange,
  placeholder,
  disabled,
  id,
  disabledDates,
}: DateRangePickerProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="bg-transparent">
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value?.from && "text-muted-foreground",
          )}
        >
          <CalendarIcon />
          <span className="truncate">
            {value?.from ? (
              value.to ? (
                `${format(value.from, "PP")} - ${format(value.to, "PP")}`
              ) : (
                format(value.from, "PP")
              )
            ) : (
              <span>{placeholder ? placeholder : t('common.pickDates')}</span>
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={(date) => {
            onChange(date);
          }}
          disabled={disabledDates}
          fixedWeeks
          numberOfMonths={1}
          defaultMonth={value?.from}
          autoFocus
        />
        {value?.from && (
          <div className="flex justify-end border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange(undefined)}
            >
              {t("common.clear")}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
