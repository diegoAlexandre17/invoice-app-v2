import { logoutUseCase } from "@/features/auth/application/useCases/logoutUseCase";
import { authRepository } from "@/features/auth/infrastructure/authRepository";
import { useMutation } from "@tanstack/react-query";

export const useLogout = () => {
  return useMutation({
    mutationFn: () => logoutUseCase(authRepository),
  });
};