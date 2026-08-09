import { createInvoiceUseCase } from "@/features/invoices/application/useCases/createInvoiceUseCase";
import type { Invoice } from "@/features/invoices/domain/entities/Invoice";
import { invoiceRepositoryInstance } from "@/features/invoices/infrastructure/invoiceRepositoryInstance";
import { useMutation } from "@tanstack/react-query";

export const useCreateInvoice = () => {
  return useMutation({
    mutationFn: (
      invoiceData: Omit<Invoice, "id" | "createdAt" | "paidAt" | "pdfUrl">,
    ) => createInvoiceUseCase(invoiceRepositoryInstance, invoiceData),
  });
};
