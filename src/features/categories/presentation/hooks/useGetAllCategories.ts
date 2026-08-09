import { getAllCategoriesUseCase } from "@/features/categories/application/useCases/getAllCategoriesUseCase";
import type { Category } from "@/features/categories/domain/entities/Category";
import { categoryRepositoryInstance } from "@/features/categories/infrastructure/categoryRepositoryInstance";
import { useQuery } from "@tanstack/react-query";

export const useGetAllCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => getAllCategoriesUseCase(categoryRepositoryInstance),
  });
};
