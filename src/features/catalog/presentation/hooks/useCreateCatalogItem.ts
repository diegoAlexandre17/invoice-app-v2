import { createCatalogItemUseCase } from "@/features/catalog/application/useCases/createCatalogItemUseCase";
import type { CatalogItem } from "@/features/catalog/domain/entities/CatalogItem";
import { catalogRepositoryInstance } from "@/features/catalog/infrastructure/catalogRepositoryInstance";
import { useMutation } from "@tanstack/react-query";

export const useCreateCatalogItem = () => {
  return useMutation({
    mutationFn: (
      itemData: Omit<CatalogItem, "id" | "createdAt" | "categoryName">,
    ) => createCatalogItemUseCase(catalogRepositoryInstance, itemData),
  });
};
