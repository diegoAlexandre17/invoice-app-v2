import { updatePasswordUseCase } from "@/features/auth/application/useCases/updatePasswordUseCase";
import { authRepository } from "@/features/auth/infrastructure/authRepository";
import { useMutation } from "@tanstack/react-query";

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (newPassword: string) =>
      updatePasswordUseCase(authRepository, newPassword),
  });
};