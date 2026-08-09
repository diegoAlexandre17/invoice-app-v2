import type { InvoiceStatus } from "@/features/invoices/domain/entities/Invoice";
import type { InvoiceRepository } from "@/features/invoices/domain/repositories/InvoiceRepository";

export const updateInvoiceStatusUseCase = (
  invoiceRepository: InvoiceRepository,
  invoiceId: number,
  status: InvoiceStatus,
): Promise<void> => {
  return invoiceRepository.updateStatus(invoiceId, status);
};
