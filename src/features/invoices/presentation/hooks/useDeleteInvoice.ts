import { deleteInvoiceUseCase } from "@/features/invoices/application/useCases/deleteInvoiceUseCase";
import { invoiceRepositoryInstance } from "@/features/invoices/infrastructure/invoiceRepositoryInstance";
import { useMutation } from "@tanstack/react-query";

export const useDeleteInvoice = () => {
  return useMutation({
    mutationFn: (invoiceId: number) =>
      deleteInvoiceUseCase(invoiceRepositoryInstance, invoiceId),
  });
};
