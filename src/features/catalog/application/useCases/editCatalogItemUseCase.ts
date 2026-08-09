import type { CatalogItem } from "@/features/catalog/domain/entities/CatalogItem";
import type { CatalogRepository } from "@/features/catalog/domain/repositories/CatalogRepository";

export const editCatalogItemUseCase = (
  catalogRepository: CatalogRepository,
  itemData: Omit<CatalogItem, "createdAt" | "categoryName">,
): Promise<void> => {
  return catalogRepository.edit(itemData);
};
