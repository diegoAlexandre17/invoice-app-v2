import type { LoginCredentials, User } from "@/features/auth/domain/entities/User";
import type { AuthRepository } from "@/features/auth/domain/repositories/AuthRepository";

/**
 * CASO DE USO: iniciar sesión.
 *
 * Representa UNA acción del negocio. Orquesta la operación usando el CONTRATO
 * (AuthRepository), no una implementación concreta. Esto se llama "inyección
 * de dependencias": el repositorio entra por parámetro, el caso de uso no lo crea.
 *
 * Acá viven las reglas de negocio puras (si hubiera). Por ahora solo delega,
 * pero este es el lugar donde pondrías cosas como "no permitir login si la
 * cuenta está bloqueada", registrar auditoría, etc.
 */
export const loginUseCase = (
  authRepository: AuthRepository,
  credentials: LoginCredentials
): Promise<User> => {
  return authRepository.login(credentials);
};
