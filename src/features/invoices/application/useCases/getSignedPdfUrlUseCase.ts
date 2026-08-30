import type { InvoiceRepository } from "@/features/invoices/domain/repositories/InvoiceRepository";

export const getSignedPdfUrlUseCase = (
  invoiceRepository: InvoiceRepository,
  path: string,
): Promise<string> => {
  return invoiceRepository.getSignedPdfUrl(path);
};
