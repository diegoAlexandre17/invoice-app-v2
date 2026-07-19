import { createCustomerUseCase } from "@/features/customers/application/useCases/createCustomerUseCase";
import type { Customer } from "@/features/customers/domain/entities/Customer";
import { customerRepositoryInstance } from "@/features/customers/infrastructure/customerRepositoryInstance";
import { useMutation } from "@tanstack/react-query";

export const useCreateCustomer = () => {
  return useMutation({
    mutationFn: (customerData: Omit<Customer, "id" | "createdAt">) =>
      createCustomerUseCase(customerRepositoryInstance, customerData),
  });
};
