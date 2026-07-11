import type { AuthRepository } from "@/features/auth/domain/repositories/AuthRepository";

export const recoveryPasswordUseCase = async (
  authRepository: AuthRepository,
  email: string
): Promise<void> => {
  return authRepository.recoverPassword(email);
};