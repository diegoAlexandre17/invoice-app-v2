import { getSignedPdfUrlUseCase } from "@/features/invoices/application/useCases/getSignedPdfUrlUseCase";
import { invoiceRepositoryInstance } from "@/features/invoices/infrastructure/invoiceRepositoryInstance";
import { useMutation } from "@tanstack/react-query";

export const useGetSignedPdfUrl = () => {
  return useMutation({
    mutationFn: (path: string) =>
      getSignedPdfUrlUseCase(invoiceRepositoryInstance, path),
  });
};