import { getCurrentUserUseCase } from "@/features/auth/application/useCases/getCurrentUserUseCase";
import { authRepositoryInstance } from "@/features/auth/infrastructure/authRepository";
import { useQuery } from "@tanstack/react-query";

/**
 * HOOK de presentación: verifica si existe una sesión válida en la pantalla
 * de reset password.
 *
 * Usa `useQuery` (no mutation) porque LEER la sesión es una consulta de datos,
 * no un cambio. Devuelve:
 *   - isLoading: mientras verifica (mostrar loader)
 *   - data (User | null): si es null, no hay sesión → el usuario no vino del email
 */
export const useRecoverySession = () => {
  return useQuery({
    queryKey: ["recovery-session"],
    queryFn: () => getCurrentUserUseCase(authRepositoryInstance),
    retry: false, // si no hay sesión, no tiene sentido reintentar
  });
};
