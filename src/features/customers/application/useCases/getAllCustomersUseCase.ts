import type {
  Customer,
  GetCustomersParams,
} from "@/features/customers/domain/entities/Customer";
import type { CustomerRepository } from "@/features/customers/domain/repositories/CustomerRepository";
import type { PaginatedResult } from "@/shared/domain/pagination";

export const getAllCustomersUseCase = (
  customerRepository: CustomerRepository,
  params?: GetCustomersParams
): Promise<PaginatedResult<Customer>> => {
  return customerRepository.getAll(params);
};