import { cn, formatMoney } from "@/lib/utils";
import type { Currency } from "@/shared/domain/currency";
import { useTranslation } from "react-i18next";

interface MoneyNumberProps {
  /** Monto a formatear. */
  amount: number;
  /** Moneda del monto. La decide el caller: invoice.currency (documento
   *  emitido) o company.currency (documento nuevo / agregados del dashboard). */
  currency: Currency;
  /** Clases extra para el <span> contenedor. */
  className?: string;
}

/**
 * Renderiza un monto como moneda formateada según el idioma activo.
 * Presentacional: la moneda se recibe por prop, no se lee de ningún context
 * (respeta el snapshot congelado de cada factura). El formateo vive en
 * formatMoney (puro); acá solo se inyecta el locale de i18next.
 */
const MoneyNumber = ({ amount, currency, className }: MoneyNumberProps) => {
  const { i18n } = useTranslation();

  return (
    <span className={cn("text-success", className)}>
      {formatMoney(amount, currency, i18n.language)}
    </span>
  );
};

export default MoneyNumber;
