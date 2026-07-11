import type { AuthRepository } from "@/features/auth/domain/repositories/AuthRepository";

export const updatePasswordUseCase = (
  authRepository: AuthRepository,
  newPassword: string
): Promise<void> => {
  return authRepository.updatePassword(newPassword);
};