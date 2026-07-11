import type { LoginCredentials, RegisterCredentials, User } from "../entities/User";

/**
 * CONTRATO (el "enchufe") del repositorio de autenticación.
 *
 * Define QUÉ se puede hacer con la autenticación, pero NO el CÓMO.
 * - Hoy lo implementa SupabaseAuthRepository (infrastructure).
 * - Mañana lo implementará tu backend propio (otra clase en infrastructure).
 *
 * Los casos de uso (application) dependen de ESTA interfaz, nunca de Supabase.
 * Por eso podés cambiar el backend sin tocar la lógica de negocio.
 */
export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  register(credentials: RegisterCredentials): Promise<User>;
  recoverPassword(email: string): Promise<void>;
  updatePassword(newPassword: string): Promise<void>;
}
