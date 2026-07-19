import { getAllCustomersUseCase } from "@/features/customers/application/useCases/getAllCustomersUseCase";
import type {
  Customer,
  GetCustomersParams,
} from "@/features/customers/domain/entities/Customer";
import { customerRepositoryInstance } from "@/features/customers/infrastructure/customerRepositoryInstance";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetAllCustomers = (params?: GetCustomersParams) => {
  const search = params?.search?.trim() ?? "";

  return useQuery<Customer[]>({
    queryKey: ["customers", { search }],
    queryFn: () => getAllCustomersUseCase(customerRepositoryInstance, { search }),
    placeholderData: keepPreviousData,
  });
};