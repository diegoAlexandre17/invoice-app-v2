import { useMutation } from "@tanstack/react-query";
import type { LoginCredentials } from "../../domain/entities/User";
import { loginUseCase } from "../../application/useCases/loginUseCase";
import { SupabaseAuthRepository } from "../../infrastructure/SupabaseAuthRepository";

/**
 * Instanciamos el repositorio UNA vez, fuera del hook.
 *
 * 👉 ESTA ES LA ÚNICA LÍNEA QUE CAMBIÁS AL MIGRAR DE BACKEND.
 * Reemplazás SupabaseAuthRepository por tu HttpAuthRepository y listo.
 */
const authRepository = new SupabaseAuthRepository();

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
      loginUseCase(authRepository, credentials),
  });
};
