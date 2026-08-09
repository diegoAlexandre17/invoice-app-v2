import type {
  Invoice,
  GetInvoicesParams,
} from "@/features/invoices/domain/entities/Invoice";
import type { InvoiceRepository } from "@/features/invoices/domain/repositories/InvoiceRepository";
import type { PaginatedResult } from "@/shared/domain/pagination";

export const getAllInvoicesUseCase = (
  invoiceRepository: InvoiceRepository,
  params?: GetInvoicesParams,
): Promise<PaginatedResult<Invoice>> => {
  return invoiceRepository.getAll(params);
};
