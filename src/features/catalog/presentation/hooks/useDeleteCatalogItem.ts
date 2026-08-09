import { deleteCatalogItemUseCase } from "@/features/catalog/application/useCases/deleteCatalogItemUseCase";
import { catalogRepositoryInstance } from "@/features/catalog/infrastructure/catalogRepositoryInstance";
import { useMutation } from "@tanstack/react-query";

export const useDeleteCatalogItem = () => {
  return useMutation({
    mutationFn: (itemId: number) =>
      deleteCatalogItemUseCase(catalogRepositoryInstance, itemId),
  });
};
