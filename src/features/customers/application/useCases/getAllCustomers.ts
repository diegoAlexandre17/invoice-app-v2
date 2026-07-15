import type {
  Customer,
  GetCustomersParams,
} from "@/features/customers/domain/entities/Customer";
import type { CustomerRepository } from "@/features/customers/domain/repositories/CustomerRepository";

export const getAllCustomersUseCase = (
  customerRepository: CustomerRepository,
  params?: GetCustomersParams
): Promise<Customer[]> => {
  return customerRepository.getAll(params);
};