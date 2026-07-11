import { registerUseCase } from "@/features/auth/application/useCases/registerUseCase";
import type { RegisterCredentials } from "@/features/auth/domain/entities/User";
import { authRepository } from "@/features/auth/infrastructure/authRepository";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      registerUseCase(authRepository, credentials),
  });
};