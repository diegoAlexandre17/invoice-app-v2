import { supabase } from "@/shared/infrastructure/supabase/supabaseClient";
import type {
  LoginCredentials,
  RecoverPasswordCredentials,
  RegisterCredentials,
  User,
} from "../domain/entities/User";
import type { AuthRepository } from "../domain/repositories/AuthRepository";
import { PATHS } from "@/router/paths";
import { mapSupabaseError } from "@/shared/infrastructure/supabase/mapSupabaseError";

/**
 * IMPLEMENTACIÓN del contrato AuthRepository usando Supabase.
 *
 * ⚠️ ESTE ES EL ARCHIVO "MOMENTÁNEO". El día que migres a tu backend propio,
 * creás un `HttpAuthRepository` que implemente la MISMA interfaz y cambiás
 * una sola línea en el hook de presentación. El resto de la app ni se entera.
 *
 * Su trabajo: hablar con Supabase y TRADUCIR su respuesta a tu entidad User.
 */
export class SupabaseAuthRepository implements AuthRepository {
  async login({
    email,
    password,
    captchaToken,
  }: LoginCredentials): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken },
    });

    if (error || !data.user) {
      throw mapSupabaseError(error)
    }

    // Traducción: de la forma de Supabase → a tu entidad de dominio.
    return {
      id: data.user.id,
      email: data.user.email ?? "",
      name: data.user.user_metadata.first_name ?? "-",
    };
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw mapSupabaseError(error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;

    return {
      id: data.user.id,
      email: data.user.email ?? "",
      name: data.user.user_metadata.first_name ?? "-",
    };
  }

  async register({
    email,
    password,
    name,
    captchaToken,
  }: RegisterCredentials): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        captchaToken,
        data: {
          first_name: name,
        },
      },
    });

    if (error || !data.user) {
      throw mapSupabaseError(error);
    }

    return {
      id: data.user.id,
      email: data.user.email ?? "",
      name: data.user.user_metadata.first_name ?? "-",
    };
  }

  async recoverPassword({
    email,
    captchaToken,
  }: RecoverPasswordCredentials): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      captchaToken,
      redirectTo: `${window.location.origin}${PATHS.resetPassword}`,
    });

    if (error) {
      throw mapSupabaseError(error)
    }
  }

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      throw mapSupabaseError(error);
    }
  }
}
