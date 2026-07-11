import { recoveryPasswordUseCase } from "@/features/auth/application/useCases/recoveryPasswordUseCase";
import { SupabaseAuthRepository } from "@/features/auth/infrastructure/SupabaseAuthRepository";
import { useMutation } from "@tanstack/react-query";

const authRepository = new SupabaseAuthRepository();


export const useRecoveryPassword = () => {
  return useMutation({
    mutationFn: (email: string) =>
      recoveryPasswordUseCase(authRepository, email),
  });
};