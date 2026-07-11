import { getCurrentUserUseCase } from "@/features/auth/application/useCases/getCurrentUserUseCase";
import { SupabaseAuthRepository } from "@/features/auth/infrastructure/SupabaseAuthRepository";
import { useQuery } from "@tanstack/react-query";

const authRepository = new SupabaseAuthRepository();

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
    queryFn: () => getCurrentUserUseCase(authRepository),
    retry: false, // si no hay sesión, no tiene sentido reintentar
  });
};
