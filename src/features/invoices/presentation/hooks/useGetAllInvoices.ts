import { getAllInvoicesUseCase } from "@/features/invoices/application/useCases/getAllInvoicesUseCase";
import type {
  Invoice,
  GetInvoicesParams,
} from "@/features/invoices/domain/entities/Invoice";
import { invoiceRepositoryInstance } from "@/features/invoices/infrastructure/invoiceRepositoryInstance";
import type { PaginatedResult } from "@/shared/domain/pagination";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetAllInvoices = (params?: GetInvoicesParams) => {
  const search = params?.search?.trim() ?? "";
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const status = params?.status;
  const overdue = params?.overdue;
  const dateFrom = params?.dateFrom;
  const dateTo = params?.dateTo;

  return useQuery<PaginatedResult<Invoice>>({
    queryKey: [
      "invoices",
      { search, page, pageSize, status, overdue, dateFrom, dateTo },
    ],
    queryFn: () =>
      getAllInvoicesUseCase(invoiceRepositoryInstance, {
        search,
        page,
        pageSize,
        status,
        overdue,
        dateFrom,
        dateTo,
      }),
    placeholderData: keepPreviousData,
  });
};
