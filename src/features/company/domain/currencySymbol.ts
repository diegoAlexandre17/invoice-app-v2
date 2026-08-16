import type { Currency } from "@/features/company/domain/entities/Company";

// Mapa de moneda -> símbolo. Utilidad de dominio pura: opera SOBRE la entidad
// Company sin conocer React ni I/O. Al agregar una moneda nueva a `Currency`,
// TS obliga a sumar su símbolo acá (el Record es exhaustivo).
const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
};

// Devuelve el símbolo de la moneda. Si la moneda es desconocida (input
// incompleto), devuelve un valor neutro en silencio.
export const getCurrencySymbol = (currency: Currency | null | undefined): string => {
  if (!currency) return "";
  return CURRENCY_SYMBOLS[currency] ?? "";
};
