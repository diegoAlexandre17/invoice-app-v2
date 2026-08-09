import type { Invoice } from "@/features/invoices/domain/entities/Invoice";
import type { InvoiceRepository } from "@/features/invoices/domain/repositories/InvoiceRepository";

export const createInvoiceUseCase = (
  invoiceRepository: InvoiceRepository,
  invoiceData: Omit<Invoice, "id" | "createdAt" | "paidAt" | "pdfUrl">,
): Promise<void> => {
  return invoiceRepository.create(invoiceData);
};
