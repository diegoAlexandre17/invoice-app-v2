import type {
  CatalogItem,
  GetCatalogParams,
} from "@/features/catalog/domain/entities/CatalogItem";
import type { CatalogRepository } from "@/features/catalog/domain/repositories/CatalogRepository";
import type { PaginatedResult } from "@/shared/domain/pagination";

export const getAllCatalogUseCase = (
  catalogRepository: CatalogRepository,
  params?: GetCatalogParams,
): Promise<PaginatedResult<CatalogItem>> => {
  return catalogRepository.getAll(params);
};
