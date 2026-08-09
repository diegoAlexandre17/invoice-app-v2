import { getAllCatalogUseCase } from "@/features/catalog/application/useCases/getAllCatalogUseCase";
import type {
  CatalogItem,
  GetCatalogParams,
} from "@/features/catalog/domain/entities/CatalogItem";
import { catalogRepositoryInstance } from "@/features/catalog/infrastructure/catalogRepositoryInstance";
import type { PaginatedResult } from "@/shared/domain/pagination";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetAllCatalog = (params?: GetCatalogParams) => {
  const search = params?.search?.trim() ?? "";
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const type = params?.type;

  return useQuery<PaginatedResult<CatalogItem>>({
    // type entra en la key junto a search/page: cambiar el filtro
    // producto/servicio es una entrada distinta en caché y dispara refetch.
    queryKey: ["catalog", { search, page, pageSize, type }],
    queryFn: () =>
      getAllCatalogUseCase(catalogRepositoryInstance, {
        search,
        page,
        pageSize,
        type,
      }),
    placeholderData: keepPreviousData,
  });
};
