import type { Currency } from "@/shared/domain/currency";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea un monto como moneda según el locale. PURA: locale y currency se
 * inyectan, no se leen de ningún singleton. Reusable sin React (PDF, exports).
 * Usa Intl.NumberFormat: símbolo + separador de miles + 2 decimales por locale.
 * Ej: formatMoney(1234.5, "USD", "es") -> "US$ 1234,50" / ("en") -> "$1,234.50"
 */
export function formatMoney(
  amount: number,
  currency: Currency,
  locale: string,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}
