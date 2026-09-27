import MoneyNumber from "@/components/shared/MoneyNumber";
import { useGetCompanyData } from "@/features/company/presentation/useGetCompanyData";

interface CompanyMoneyProps {
  /** Monto a formatear en la moneda de la empresa. */
  amount: number;
  /** Clases extra para el <span> (override del color por default). */
  className?: string;
}

/**
 * Monto en la moneda ACTUAL de la empresa. Para agregados del dashboard
 * (KPIs, gráficos) donde no hay una factura individual: la moneda es la de
 * company. Lee company.currency de la caché (compartida, sin peticiones extra).
 * Para montos de una factura emitida usá <MoneyNumber currency={invoice.currency}>.
 */
const CompanyMoney = ({ amount, className }: CompanyMoneyProps) => {
  const { data: company } = useGetCompanyData();

  // Sin moneda no hay cómo formatear (carga inicial o cuenta sin company):
  // mostramos el monto crudo para no romper el layout ni inventar moneda.
  if (!company) {
    return <span className={className}>{amount}</span>;
  }

  return (
    <MoneyNumber
      amount={amount}
      currency={company.currency}
      className={className}
    />
  );
};

export default CompanyMoney;
