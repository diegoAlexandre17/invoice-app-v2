import type { RecoverPasswordCredentials } from "@/features/auth/domain/entities/User";
import type { AuthRepository } from "@/features/auth/domain/repositories/AuthRepository";

export const recoveryPasswordUseCase = (
  authRepository: AuthRepository,
  credentials: RecoverPasswordCredentials
): Promise<void> => {
  return authRepository.recoverPassword(credentials);
};