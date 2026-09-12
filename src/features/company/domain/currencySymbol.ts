import type { Currency } from "@/shared/domain/currency";

// TS obliga a sumar su símbolo acá (el Record es exhaustivo).
const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
};

export const getCurrencySymbol = (
  currency: Currency | null | undefined,
): string => {
  if (!currency) return "";
  return CURRENCY_SYMBOLS[currency] ?? "";
};
