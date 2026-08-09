import type { InvoiceRepository } from "@/features/invoices/domain/repositories/InvoiceRepository";

export const deleteInvoiceUseCase = (
  invoiceRepository: InvoiceRepository,
  invoiceId: number,
): Promise<void> => {
  return invoiceRepository.delete(invoiceId);
};
