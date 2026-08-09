import type { Category } from "@/features/categories/domain/entities/Category";
import type { CategoryRepository } from "@/features/categories/domain/repositories/CategoryRepository";

export const getAllCategoriesUseCase = (
  categoryRepository: CategoryRepository,
): Promise<Category[]> => {
  return categoryRepository.getAll();
};
