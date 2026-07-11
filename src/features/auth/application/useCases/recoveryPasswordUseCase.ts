import type { AuthRepository } from "@/features/auth/domain/repositories/AuthRepository";

export const recoveryPasswordUseCase = (
  authRepository: AuthRepository,
  email: string
): Promise<void> => {
  return authRepository.recoverPassword(email);
};