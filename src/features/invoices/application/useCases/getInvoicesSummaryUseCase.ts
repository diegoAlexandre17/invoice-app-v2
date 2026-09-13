import type {
  GetInvoiceSummaryParams,
  InvoiceSummary,
} from "@/features/invoices/domain/entities/InvoiceSummary";
import type { InvoiceRepository } from "@/features/invoices/domain/repositories/InvoiceRepository";

export const getInvoicesSummaryUseCase = (
  invoiceRepository: InvoiceRepository,
  params: GetInvoiceSummaryParams,
): Promise<InvoiceSummary> => {
  return invoiceRepository.getSummary(params);
};
