import { supabase } from "@/shared/infrastructure/supabase/supabaseClient";
import type { LoginCredentials, User } from "../domain/entities/User";
import type { AuthRepository } from "../domain/repositories/AuthRepository";

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
  async login({ email, password }: LoginCredentials): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      throw new Error(error?.message ?? "No se pudo iniciar sesión");
    }

    // Traducción: de la forma de Supabase → a tu entidad de dominio.
    console.log(data)
    return {
      id: data.user.id,
      email: data.user.email ?? "",
    };
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;

    return {
      id: data.user.id,
      email: data.user.email ?? "",
    };
  }
}
