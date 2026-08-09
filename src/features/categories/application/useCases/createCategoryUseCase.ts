import type { Category } from "@/features/categories/domain/entities/Category";
import type { CategoryRepository } from "@/features/categories/domain/repositories/CategoryRepository";

export const createCategoryUseCase = (
  categoryRepository: CategoryRepository,
  categoryData: Omit<Category, "id" | "createdAt">,
): Promise<Category> => {
  return categoryRepository.create(categoryData);
};
