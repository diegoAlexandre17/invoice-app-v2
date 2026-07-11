import { registerUseCase } from "@/features/auth/application/useCases/registerUseCase";
import type { RegisterCredentials } from "@/features/auth/domain/entities/User";
import { SupabaseAuthRepository } from "@/features/auth/infrastructure/SupabaseAuthRepository";
import { useMutation } from "@tanstack/react-query";

const authRepository = new SupabaseAuthRepository();


export const useRegister = () => {
  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      registerUseCase(authRepository, credentials),
  });
};