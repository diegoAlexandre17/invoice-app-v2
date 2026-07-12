import { getAllCustomersUseCase } from "@/features/customers/application/useCases/getAllCustomers";
import type { Customer } from "@/features/customers/domain/entities/Customer";
import { customerRepositoryInstance } from "@/features/customers/infrastructure/customerRepositoryInstance";
import { useQuery } from "@tanstack/react-query";

export const useGetAllCustomers = () => {
  return useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: () => getAllCustomersUseCase(customerRepositoryInstance),
  });
};