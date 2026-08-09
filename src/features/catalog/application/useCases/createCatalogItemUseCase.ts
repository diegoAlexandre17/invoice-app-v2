import type { CatalogItem } from "@/features/catalog/domain/entities/CatalogItem";
import type { CatalogRepository } from "@/features/catalog/domain/repositories/CatalogRepository";

export const createCatalogItemUseCase = (
  catalogRepository: CatalogRepository,
  itemData: Omit<CatalogItem, "id" | "createdAt" | "categoryName">,
): Promise<void> => {
  return catalogRepository.create(itemData);
};
