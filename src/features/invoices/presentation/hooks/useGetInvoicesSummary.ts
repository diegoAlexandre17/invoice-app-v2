import { getInvoicesSummaryUseCase } from "@/features/invoices/application/useCases/getInvoicesSummaryUseCase";
import type {
  InvoiceSummary,
  GetInvoiceSummaryParams,
} from "@/features/invoices/domain/entities/InvoiceSummary";
import { invoiceRepositoryInstance } from "@/features/invoices/infrastructure/invoiceRepositoryInstance";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

// El hook acepta los filtros SIN 'today': ese lo calcula acá, en el borde
// de la app, una sola vez por render. Así el resto de la app no se ocupa
// de "hoy" y el repo lo recibe inyectado (testeable + predecible).
type UseInvoiceSummaryParams = Omit<GetInvoiceSummaryParams, "today">;

export const useGetInvoicesSummary = (params?: UseInvoiceSummaryParams) => {
  const status = params?.status;
  const dateFrom = params?.dateFrom;
  const dateTo = params?.dateTo;

  //para las facturas vencidas
  const today = format(new Date(), "yyyy-MM-dd");

  return useQuery<InvoiceSummary>({
    queryKey: ["invoices", "summary", { status, dateFrom, dateTo }],
    queryFn: () =>
      getInvoicesSummaryUseCase(invoiceRepositoryInstance, {
        today,
        status,
        dateFrom,
        dateTo,
      }),
  });
};