import type { RegisterCredentials, User } from "@/features/auth/domain/entities/User";
import type { AuthRepository } from "@/features/auth/domain/repositories/AuthRepository";

export const registerUseCase = async (
  authRepository: AuthRepository,
  credentials: RegisterCredentials
): Promise<User> => {
  return authRepository.register(credentials);
};