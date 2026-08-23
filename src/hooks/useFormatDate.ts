import { useCallback } from "react";
import { useTranslation } from "react-i18next";

/**
 * Formato de salida de la fecha:
 *  - "short"   → "22 ago 2026" (día + mes abreviado + año). Se traduce por locale.
 *  - "numeric" → "22/08/2026"  (DD/MM/YYYY).
 */
export type DateFormat = "short" | "numeric";

/**
 * Formatea una fecha según el locale y el formato indicados. PURA: las dependencias
 * (locale, formato) se inyectan, no se leen de ningún singleton global. Reusable sin
 * React. Fecha inválida → cadena vacía (nunca imprime "Invalid Date").
 */
export const formatDate = (
  date: Date | string,
  locale: string,
  format: DateFormat = "short",
): string => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString(locale, {
    day: "2-digit",
    month: format === "short" ? "short" : "2-digit",
    year: "numeric",
  });
};

/**
 * Puente a React: lee el idioma activo de i18next (reactivo — si el usuario
 * cambia de idioma en caliente, los componentes se re-renderizan) y devuelve
 * un formateador ya "cargado" con ese locale.
 *
 * Uso: const format = useFormatDate();  ...  format(invoice.issueDate)
 */
export const useFormatDate = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useCallback(
    (date: Date | string, format: DateFormat = "short") =>
      formatDate(date, locale, format),
    [locale],
  );
};
