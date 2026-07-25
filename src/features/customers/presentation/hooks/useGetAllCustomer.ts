import { getAllCustomersUseCase } from "@/features/customers/application/useCases/getAllCustomersUseCase";
import type {
  Customer,
  GetCustomersParams,
} from "@/features/customers/domain/entities/Customer";
import { customerRepositoryInstance } from "@/features/customers/infrastructure/customerRepositoryInstance";
import type { PaginatedResult } from "@/shared/domain/pagination";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetAllCustomers = (params?: GetCustomersParams) => {
  const search = params?.search?.trim() ?? "";
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;

  return useQuery<PaginatedResult<Customer>>({
    // page y pageSize entran en la key: React Query cachea por key,
    // así que cada página es una entrada distinta en caché. Sin esto,
    // cambiar de página no dispararía un refetch.
    queryKey: ["customers", { search, page, pageSize }],
    queryFn: () =>
      getAllCustomersUseCase(customerRepositoryInstance, {
        search,
        page,
        pageSize,
      }),
    placeholderData: keepPreviousData,
  });
};