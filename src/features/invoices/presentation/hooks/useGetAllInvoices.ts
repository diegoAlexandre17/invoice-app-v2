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

  return useQuery<PaginatedResult<Invoice>>({
    queryKey: ["invoices", { search, page, pageSize, status }],
    queryFn: () =>
      getAllInvoicesUseCase(invoiceRepositoryInstance, {
        search,
        page,
        pageSize,
        status,
      }),
    placeholderData: keepPreviousData,
  });
};
