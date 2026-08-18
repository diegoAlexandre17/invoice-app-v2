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
import type { Matcher } from "react-day-picker";

interface DatePickerProps {
  /** Fecha seleccionada (controlado). */
  value?: Date;
  /** Se dispara al elegir una fecha. */
  onChange: (date: Date | undefined) => void;
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

/**
 * Selector de fecha genérico: composición de Popover + Calendar (patrón shadcn).
 * Controlado por `value`/`onChange` con objetos Date, listo para envolver con
 * <Controller> de react-hook-form. No sabe nada de facturas: reutilizable.
 */
const DatePicker = ({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
  id,
  disabledDates,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);

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
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
          disabled={disabledDates}
          defaultMonth={value}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
