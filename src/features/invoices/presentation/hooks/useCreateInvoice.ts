import { createInvoiceUseCase } from "@/features/invoices/application/useCases/createInvoiceUseCase";
import type { Invoice } from "@/features/invoices/domain/entities/Invoice";
import { invoiceRepositoryInstance } from "@/features/invoices/infrastructure/invoiceRepositoryInstance";
import { useMutation } from "@tanstack/react-query";

interface CreateInvoiceInput {
  invoiceData: Omit<Invoice, "id" | "createdAt" | "paidAt" | "pdfUrl">;
  pdfBlob: Blob;
}

export const useCreateInvoice = () => {
  return useMutation({
    mutationFn: ({ invoiceData, pdfBlob }: CreateInvoiceInput) =>
      createInvoiceUseCase(invoiceRepositoryInstance, invoiceData, pdfBlob),
  });
};
