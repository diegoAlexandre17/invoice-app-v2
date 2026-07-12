import type { Customer } from "@/features/customers/domain/entities/Customer";
import type { CustomerRepository } from "@/features/customers/domain/repositories/CustomerRepository";

export const getAllCustomersUseCase = (
  customerRepository: CustomerRepository
): Promise<Customer[]> => {
  return customerRepository.getAll();
};