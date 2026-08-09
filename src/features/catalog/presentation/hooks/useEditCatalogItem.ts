import { editCatalogItemUseCase } from "@/features/catalog/application/useCases/editCatalogItemUseCase";
import type { CatalogItem } from "@/features/catalog/domain/entities/CatalogItem";
import { catalogRepositoryInstance } from "@/features/catalog/infrastructure/catalogRepositoryInstance";
import { useMutation } from "@tanstack/react-query";

export const useEditCatalogItem = () => {
  return useMutation({
    mutationFn: (itemData: Omit<CatalogItem, "createdAt" | "categoryName">) =>
      editCatalogItemUseCase(catalogRepositoryInstance, itemData),
  });
};
