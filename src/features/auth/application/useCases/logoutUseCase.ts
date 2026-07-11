import type { AuthRepository } from "@/features/auth/domain/repositories/AuthRepository";

export const logoutUseCase = (
  authRepository: AuthRepository
): Promise<void> => {
  return authRepository.logout();
};