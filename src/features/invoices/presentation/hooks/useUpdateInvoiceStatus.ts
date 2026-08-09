import { updateInvoiceStatusUseCase } from "@/features/invoices/application/useCases/updateInvoiceStatusUseCase";
import type { InvoiceStatus } from "@/features/invoices/domain/entities/Invoice";
import { invoiceRepositoryInstance } from "@/features/invoices/infrastructure/invoiceRepositoryInstance";
import { useMutation } from "@tanstack/react-query";

interface UpdateInvoiceStatusVars {
  invoiceId: number;
  status: InvoiceStatus;
}

export const useUpdateInvoiceStatus = () => {
  return useMutation({
    mutationFn: ({ invoiceId, status }: UpdateInvoiceStatusVars) =>
      updateInvoiceStatusUseCase(invoiceRepositoryInstance, invoiceId, status),
  });
};
