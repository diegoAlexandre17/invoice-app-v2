import { recoveryPasswordUseCase } from "@/features/auth/application/useCases/recoveryPasswordUseCase";
import type { RecoverPasswordCredentials } from "@/features/auth/domain/entities/User";
import { authRepositoryInstance } from "@/features/auth/infrastructure/authRepository";
import { useMutation } from "@tanstack/react-query";

export const useRecoveryPassword = () => {
  return useMutation({
    mutationFn: (data: RecoverPasswordCredentials) =>
      recoveryPasswordUseCase(authRepositoryInstance, data),
  });
};