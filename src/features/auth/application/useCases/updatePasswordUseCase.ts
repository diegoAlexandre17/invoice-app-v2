import type { AuthRepository } from "@/features/auth/domain/repositories/AuthRepository";

export const updatePasswordUseCase = async (
  authRepository: AuthRepository,
  newPassword: string
): Promise<void> => {
  return authRepository.updatePassword(newPassword);
};