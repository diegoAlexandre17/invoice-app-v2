import { getMonthlyBillingUseCase } from "@/features/invoices/application/useCases/getMonthlyBillingUseCase";
import type { MonthlyBilling } from "@/features/invoices/domain/entities/MonthlyBilling";
import { invoiceRepositoryInstance } from "@/features/invoices/infrastructure/invoiceRepositoryInstance";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export const useGetMonthlyBilling = () => {
  // 'today' se calcula acá (borde de la app) e inyecta al use case: define
  // hasta qué mes va la ventana de 3 meses.
  const today = format(new Date(), "yyyy-MM-dd");

  return useQuery<MonthlyBilling[]>({
    queryKey: ["invoices", "monthly-billing"],
    queryFn: () =>
      getMonthlyBillingUseCase(invoiceRepositoryInstance, { today }),
  });
};