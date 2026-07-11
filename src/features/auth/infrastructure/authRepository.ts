import { SupabaseAuthRepository } from "./SupabaseAuthRepository";

/**
 * Instancia ÚNICA del repositorio de autenticación.
 *
 * 👉 ESTE ES EL ÚNICO LUGAR DE TODA LA APP QUE DECIDE QUÉ BACKEND SE USA.
 * El día que migres a tu backend propio, cambiás SOLO esta línea:
 *
 *   export const authRepositoryInstance = new HttpAuthRepository();
 *
 * Todos los hooks de presentación importan esta instancia, así que no hay
 * que tocar 5 archivos: se cambia acá y toda la app queda migrada.
 */
export const authRepositoryInstance = new SupabaseAuthRepository();
