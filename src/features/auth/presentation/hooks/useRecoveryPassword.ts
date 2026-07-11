import { recoveryPasswordUseCase } from "@/features/auth/application/useCases/recoveryPasswordUseCase";
import { authRepositoryInstance } from "@/features/auth/infrastructure/authRepository";
import { useMutation } from "@tanstack/react-query";

export const useRecoveryPassword = () => {
  return useMutation({
    mutationFn: (email: string) =>
      recoveryPasswordUseCase(authRepositoryInstance, email),
  });
};