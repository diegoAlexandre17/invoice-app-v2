import { createCategoryUseCase } from "@/features/categories/application/useCases/createCategoryUseCase";
import type { Category } from "@/features/categories/domain/entities/Category";
import { categoryRepositoryInstance } from "@/features/categories/infrastructure/categoryRepositoryInstance";
import { queryClient } from "@/shared/infrastructure/query/queryClient";
import { useMutation } from "@tanstack/react-query";

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: (categoryData: Omit<Category, "id" | "createdAt">) =>
      createCategoryUseCase(categoryRepositoryInstance, categoryData),
    // Al crear, invalidamos la lista para que el combobox se refresque
    // y muestre la categoría nueva sin recargar la página.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
