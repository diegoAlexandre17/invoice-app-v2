import { editCustomerUseCase } from "@/features/customers/application/useCases/editCustomerUseCase";
import type { Customer } from "@/features/customers/domain/entities/Customer";
import { customerRepositoryInstance } from "@/features/customers/infrastructure/customerRepositoryInstance";
import { useMutation } from "@tanstack/react-query";

export const useEditCustomer = () => {
  return useMutation({
    mutationFn: (customerData: Omit<Customer, "createdAt">) =>
      editCustomerUseCase(customerRepositoryInstance, customerData),
  });
};