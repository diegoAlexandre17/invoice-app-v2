import { deleteCustomerUseCase } from "@/features/customers/application/useCases/deleteCustomerUseCase";
import { customerRepositoryInstance } from "@/features/customers/infrastructure/customerRepositoryInstance";
import { useMutation } from "@tanstack/react-query";

export const useDeleteCustomer = () => {
  return useMutation({
    mutationFn: (customerId: number) =>
      deleteCustomerUseCase(customerRepositoryInstance, customerId),
  });
};