import { updatePasswordUseCase } from "@/features/auth/application/useCases/updatePasswordUseCase";
import { SupabaseAuthRepository } from "@/features/auth/infrastructure/SupabaseAuthRepository";
import { useMutation } from "@tanstack/react-query";

const authRepository = new SupabaseAuthRepository();

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (newPassword: string) =>
      updatePasswordUseCase(authRepository, newPassword),
  });
};