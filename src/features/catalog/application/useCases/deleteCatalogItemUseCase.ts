import type { CatalogRepository } from "@/features/catalog/domain/repositories/CatalogRepository";

export const deleteCatalogItemUseCase = (
  catalogRepository: CatalogRepository,
  itemId: number,
): Promise<void> => {
  return catalogRepository.delete(itemId);
};
