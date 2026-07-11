import { useMutation } from "@tanstack/react-query";
import type { LoginCredentials } from "../../domain/entities/User";
import { loginUseCase } from "../../application/useCases/loginUseCase";
import { authRepositoryInstance } from "../../infrastructure/authRepository";

/**
 * HOOK de presentación: conecta React con el caso de uso de login.
 *
 * Usa `useMutation` porque el login es una MUTACIÓN (cambia estado en el
 * servidor), no una lectura. TanStack Query nos da gratis: isPending, isError,
 * error, y el estado de la operación, sin escribir useState/useEffect a mano.
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      loginUseCase(authRepositoryInstance, credentials),
  });
};
