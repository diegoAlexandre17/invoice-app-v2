import type {
  GetMonthlyBillingParams,
  MonthlyBilling,
} from "@/features/invoices/domain/entities/MonthlyBilling";
import type { InvoiceRepository } from "@/features/invoices/domain/repositories/InvoiceRepository";

export const getMonthlyBillingUseCase = (
  invoiceRepository: InvoiceRepository,
  params: GetMonthlyBillingParams,
): Promise<MonthlyBilling[]> => {
  return invoiceRepository.getMonthlyBilling(params);
};