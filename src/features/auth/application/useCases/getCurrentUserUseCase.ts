import type { User } from "@/features/auth/domain/entities/User";
import type { AuthRepository } from "@/features/auth/domain/repositories/AuthRepository";

/**
 * CASO DE USO: obtener el usuario actual (si hay sesión activa).
 *
 * Devuelve el User si existe una sesión válida, o null si no hay nadie logueado.
 * En la pantalla de reset password lo usamos para saber si el usuario llegó
 * desde el link del email (Supabase le creó una sesión) o entró directo (sin sesión).
 */
export const getCurrentUserUseCase = (
  authRepository: AuthRepository
): Promise<User | null> => {
  return authRepository.getCurrentUser();
};
